import { Request, Response, NextFunction } from 'express';

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('register');
}

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('login');
}

const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('logout');
}

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('refreshToken');
}

const sendVerifyMail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.send('sendVerifyMail');
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