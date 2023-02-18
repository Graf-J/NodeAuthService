import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { privateRsaKey } from '../certs/private';

const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

const isPasswordValid = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateAccessToken = (id: string, role: string): string => {
    const payload = {
        userId: id,
        userRole: role
    }
    const token = jwt.sign(payload, privateRsaKey, {
        expiresIn: '15m',
        issuer: process.env.TOKEN_ISSUER,
        algorithm: 'RS256'
    })
    return token;
}

const generateRefreshToken = (id: string, role: string): string => {
    const payload = {
        userId: id,
        userRole: role
    }
    const secret = process.env.REFRESH_TOKEN_SECRET
    const options = {
        expiresIn: '1y',
        issuer: process.env.TOKEN_ISSUER
    }

    const token = jwt.sign(payload, secret, options);
    return token;
}

const verifyRefreshToken = (refreshToken: string) => {
    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return {
            userId: decodedToken['userId'],
            userRole: decodedToken['userRole']
        }
    } catch (error) {
        throw createError.Unauthorized(error.message);
    }
}

const generateRandomToken = (): string => {
     const token: string = crypto.randomBytes(64).toString('hex');
     return token
}

export {
    hashPassword,
    isPasswordValid,
    generateRandomToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}