import express, { json } from 'express';
import 'express-async-errors';
// import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/singup';
import { errorHandler, NotFoundError } from '@fairdeal/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); //fon ingress-nginx
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // to send cookies over http in test mode only
        // secure: false,
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//temporary for testing
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
