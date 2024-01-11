import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

//NOTE: this does not work any more
// declare global {
//     namespace NodeJS {
//         interface Global {
//             signin(): Promise<string[]>;
//         }
//     }
// }

declare global {
    function signin(): Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY =
        'not best way to do this, used just to fix testing issue right now';
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
global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};
