import express, { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
})

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