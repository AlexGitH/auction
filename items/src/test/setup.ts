import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

//NOTE: this does not work any more
// declare global {
//     namespace NodeJS {
//         interface Global {
//             signin(): Promise<string[]>;
//         }
//     }
// }

declare global {
    function signin(userId?: string): string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'not best way to do this, used just to fix testing issue right now';
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to mongodb!');
    } catch (err) {
        console.log('MONGO ERROR:', err);
    }
});

beforeEach(async () => {
    // clear all mocks before each spec
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// it is not good approach, but it can be applicable only for testing mode
global.signin = (userId?: string) => {
    const id = userId || new mongoose.Types.ObjectId().toHexString();

    // create synthetic user payload
    const payload = {
        id,
        email: 'test@test.com',
    };

    // create jwt token from payload
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // create session object wiht jwt key
    const session = { jwt: token };

    // convert session object to string
    const sessionJSON = JSON.stringify(session);

    // convert to base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return synthetic cookie
    return [`session=${base64}`];
};
