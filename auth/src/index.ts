import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    console.log('starting auth..');

    // {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex:true
    //     }

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb(auth)!');
    } catch (err) {
        console.log('MONGO ERROR:', err);
    }
};

app.listen(3000, () => {
    console.log('Listen on port 3000!!!');
});

start();
