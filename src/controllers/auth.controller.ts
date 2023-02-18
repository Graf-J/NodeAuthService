import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { hashPassword, isPasswordValid, generateRandomToken, generateAccessToken, generateRefreshToken } from '../services/auth.service';
import MailClient from '../services/mail.service';
import { setRefreshToken } from '../services/redis.service';
import { validateRegisterBody, validateLoginBody } from '../validators/auth.validators';
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

        const refreshToken = generateRefreshToken(user.id);
        setRefreshToken(user.id, refreshToken, 365 * 24 * 60 * 60);

        const accessToken = generateAccessToken(user.id, user.role);

        res.json({ refreshToken, accessToken })
    } catch (error) {
        next(error);
    }
}

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('logout');
}

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('refreshToken');
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
    res.send('verifyMail');
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('forgotPassword');
}

const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('resetPassword');
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