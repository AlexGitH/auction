import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const ROUTE = '/api/items/currentuser';

const createUserId = () => new mongoose.Types.ObjectId().toHexString();

let cookieOne: string[];
let cookieTwo: string[];

beforeAll(async () => {
    cookieOne = global.signin(createUserId());
    cookieTwo = global.signin(createUserId());
});

const createItem = (cookie: string[]) => {
    return request(app)
        .post('/api/items')
        .set('Cookie', cookie)
        .send({
            name: 'aksjdlfa',
            startPrice: 20,
            description: 'test',
        });
};

it('can fetch a list of user items', async () => {
    await createItem(cookieOne);
    await createItem(cookieOne);
    await createItem(cookieTwo);

    const responseOne = await request(app)
        .get(ROUTE)
        .set('Cookie', cookieOne)
        .send()
        .expect(200);

    expect(responseOne.body.length).toEqual(2);

    const responseTwo = await request(app)
        .get(ROUTE)
        .set('Cookie', cookieTwo)
        .send()
        .expect(200);

    expect(responseTwo.body.length).toEqual(1);
});
