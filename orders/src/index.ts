import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { ItemCreatedListener } from './events/listeners/item-created-listener';
import { ItemUpdatedListener } from './events/listeners/item-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
    // {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex:true
    //     }

    console.log('Starting...');

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        const closeStan = () => natsWrapper.client.close();
        process.on('SIGINT', closeStan);
        process.on('SIGTERM', closeStan);

        // define listeners
        new ItemCreatedListener(natsWrapper.client).listen();
        new ItemUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb(orders)!');
    } catch (err) {
        console.log('MONGO or NATS ERROR:', err);
    }
};

app.listen(3000, () => {
    console.log('Listen on port 3000!!!');
});

start();
