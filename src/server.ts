import express, { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import { AuthRequest } from './models/authRequest';
import { isUser, isAdmin, isSuperUser } from './middleware/auth.middleware';
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/open', (req: Request, res: Response) => {
    res.send('Open Endpoint works');
})

app.get('/secure/user', [isUser], (req: AuthRequest, res: Response) => {
    res.json({ 
        message: 'Secure User-Endpoint works',
        userId: req.userId,
        userRole: req.userRole
    });
})

app.get('/secure/admin', [isAdmin], (req: AuthRequest, res: Response) => {
    res.json({ 
        message: 'Secure Admin-Endpoint works',
        userId: req.userId,
        userRole: req.userRole
    });
})

app.get('/secure/superuser', [isSuperUser], (req: AuthRequest, res: Response) => {
    res.json({ 
        message: 'Secure SuperUser-Endpoint works',
        userId: req.userId,
        userRole: req.userRole
    });
})

app.use('/auth', require('./routers/auth.router'));

app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(createError.NotFound());
})

app.use((error: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    res.send({
        status: error.status || 500,
        message: error.message || 'Internal Server Error'
    });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth-Service Listening on Port ${ PORT }`));