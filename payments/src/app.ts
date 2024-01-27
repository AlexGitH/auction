import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from '@fairdeal/common';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); //fon ingress-nginx
app.use(json());
app.use(
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== 'test', // to send cookies over http in test mode only
        secure: false,
    })
);

app.use(currentUser);

app.use(createChargeRouter);

// NO ROUTES BELOW

//temporary for testing
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
