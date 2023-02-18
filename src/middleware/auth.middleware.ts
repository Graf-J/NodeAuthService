import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { AuthRequest } from '../models/authRequest';
import { Roles } from '../models/roles';
import { publicRsaKey } from '../certs/public';

const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw createError.Unauthorized();
    
        const accessToken = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(accessToken, publicRsaKey);
        
        req.userId = decodedToken['userId'];
        req.userRole = decodedToken['userRole'];

        next();
    } catch (error) {
        const message = error.name === 'JsonWebTokenError' ? '' : error.message;
        error.message = message;
        next(createError.Unauthorized(error));
    }
}

const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw createError.Unauthorized();
    
        const accessToken = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(accessToken, publicRsaKey);

        if (decodedToken['userRole'] !== Roles.ADMIN && decodedToken['userRole'] !== Roles.SUPERUSER)
            throw createError.Unauthorized('You have to be Admin to perform this action');
        
        req.userId = decodedToken['userId'];
        req.userRole = decodedToken['userRole'];

        next();
    } catch (error) {
        const message = error.name === 'JsonWebTokenError' ? '' : error.message;
        error.message = message;
        next(createError.Unauthorized(error));
    }
}

const isSuperUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw createError.Unauthorized();
    
        const accessToken = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(accessToken, publicRsaKey);

        if (decodedToken['userRole'] !== Roles.SUPERUSER)
            throw createError.Unauthorized('You have to be SuperUser to perform this action');
        
        req.userId = decodedToken['userId'];
        req.userRole = decodedToken['userRole'];

        next();
    } catch (error) {
        const message = error.name === 'JsonWebTokenError' ? '' : error.message;
        error.message = message;
        next(createError.Unauthorized(error));
    }
}

export {
    isUser,
    isAdmin,
    isSuperUser
}