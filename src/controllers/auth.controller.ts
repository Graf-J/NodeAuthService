import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { 
    hashPassword, 
    isPasswordValid, 
    generateRandomToken, 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken
} from '../services/auth.service';
import MailClient from '../services/mail.service';
import { 
    getRefreshToken, 
    setRefreshToken, 
    deleteRefreshToken 
} from '../services/redis.service';
import { 
    validateRegisterBody, 
    validateLoginBody, 
    validateVerifyMailBody,
    validateRefreshTokenBody,
    validateEmailBody,
    validateResetPasswordBody
} from '../validators/auth.validators';
import { prisma } from '../db/prisma';

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateRegisterBody(req.body);
        if (body.error) throw createError.BadRequest(body.error.message);

        const doesExist = await prisma.user.findFirst({ where: { email: body.value.email } });
        if (doesExist) throw createError.Conflict(`User with ${ body.value.email } already exists`);

        const hashedPassword = await hashPassword(body.value.password);
        const token = generateRandomToken();
        await prisma.user.create({
            data: {
                email: body.value.email,
                passwordHash: hashedPassword,
                verifyToken: token
            }
        });
    
        MailClient.sendVerifyToken(body.value.email, token);
        
        res.json({ message: 'Verification-Token sent via Mail' });
    } catch (error) {
        next(error);
    }
}

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateLoginBody(req.body)
        if (body.error) throw createError.BadRequest(body.error.message);

        const user = await prisma.user.findFirst({ where: { email: body.value.email }});
        if (!user) throw createError.NotFound('User not found');
        if (!user.verified) throw createError.Conflict('Email not verified');
        const isPWValid = await isPasswordValid(body.value.password, user.passwordHash);
        if (!isPWValid) throw createError.Conflict('Password is not correct');

        const refreshToken = generateRefreshToken(user.id, user.role);
        await setRefreshToken(user.id, refreshToken, 365 * 24 * 60 * 60); // Expires in 1 Year

        const accessToken = generateAccessToken(user.id, user.role);

        res.json({ refreshToken, accessToken })
    } catch (error) {
        next(error);
    }
}

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateRefreshTokenBody(req.body);
        if (body.error) throw createError.BadRequest(body.error.message);
        
        const { userId } = verifyRefreshToken(body.value.refreshToken);
        await deleteRefreshToken(userId);

        res.json({ message: 'User logged out' });
    } catch (error) {
        next(error);
    }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateRefreshTokenBody(req.body);
        if (body.error) throw createError.BadRequest(body.error.message);
    
        const { userId, userRole } = verifyRefreshToken(body.value.refreshToken);
        const refreshToken = await getRefreshToken(userId);
    
        if (!refreshToken === body.value.refreshToken) throw createError.Unauthorized('Refresh Token not valid');
    
        const newAccessToken = generateAccessToken(userId, userRole);
        const newRefreshToken = generateRefreshToken(userId, userRole);
        await setRefreshToken(userId, newRefreshToken, 365 * 24 * 60 * 60); // Expires in 1 Year
    
        res.json({ refreshToken: newRefreshToken, accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
    
}

const sendVerifyMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateLoginBody(req.body)
        if (body.error) throw createError.BadRequest(body.error.message);

        const user = await prisma.user.findFirst({ where: { email: body.value.email }});
        if (!user) throw createError.NotFound('User not found');
        const isPWValid = await isPasswordValid(body.value.password, user.passwordHash);
        if (!isPWValid) throw createError.Conflict('Password is not correct');
        if (user.verified) throw createError.Conflict('User already verified');

        MailClient.sendVerifyToken(user.email, user.verifyToken);

        res.json({ message: 'Verification-Token sent via Mail' })
    } catch (error) {
        next(error);
    }
}

const verifyMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateVerifyMailBody(req.body);
        if (body.error) throw createError.BadRequest(body.error.message);
    
        const user = await prisma.user.findFirst({ where: { verifyToken: body.value.verifyToken }});
        if (!user) throw createError.NotFound('User is not registerd');
        if (user.verified) throw createError.Conflict('Users Email already verified');
    
        await prisma.user.update({
            where: { id: user.id },
            data: { verified: true }
        })

        res.json({ message: 'Verified Mail-Adress' });
    } catch (error) {
        next(error);
    }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateEmailBody(req.body);
        if (body.error) throw createError.BadRequest(body.error.message);
    
        const user = await prisma.user.findFirst({ where: { email: req.body.email }});
        if (!user) throw createError.BadRequest('User not found');
    
        const randomToken = generateRandomToken();
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                resetPasswordToken: randomToken,
                resetPasswordDate: new Date(new Date().getTime() + 15 * 60000) // 15 Minutes in the Future
            }
        });

        MailClient.sendResetPasswordToken(user.email, randomToken);

        res.json({ message: 'Reset-Password-Token sent via Mail' });
    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = validateResetPasswordBody(req.body);
        if (body.error) throw createError.BadRequest(body.error.message);

        const user = await prisma.user.findFirst({ where: { resetPasswordToken: body.value.resetPasswordToken }});
        if (!user) throw createError.NotFound('User not found');
        
        const now = new Date();
        if (user.resetPasswordDate < now) throw createError.Conflict('Password-Reset-Token expired');

        const hashedPassword = await hashPassword(body.value.password);
        await prisma.user.update({
            where: { id: user.id},
            data: { passwordHash: hashedPassword }
        });

        res.json({ message: 'Password has been reset' });
    } catch (error) {
        next(error);
    }
}

const jwks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('jwks');
}

export {
    login,
    register,
    logout,
    refreshToken,
    sendVerifyMail,
    verifyMail,
    forgotPassword,
    resetPassword,
    jwks
}