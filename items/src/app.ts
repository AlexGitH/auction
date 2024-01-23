import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUser, errorHandler, NotFoundError } from '@fairdeal/common';
import cookieSession from 'cookie-session';
import { createItemRouter } from './routes/new';
import { showItemRouter } from './routes/show';
import { indexItemRouter } from './routes/index';
import { updateItemRouter } from './routes/update';
import { userItemsRouter } from './routes/user-items';

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

app.use(currentUser);

app.use(userItemsRouter);
app.use(createItemRouter);
app.use(showItemRouter);
app.use(indexItemRouter);
app.use(updateItemRouter);

//temporary for testing
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
