import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const ROUTE = '/api/items';

const createItem = () => {
    return request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name: 'aksjdlfa',
            startPrice: 20,
        });
};

it('can fetch a list of items', async () => {
    await createItem();
    await createItem();
    await createItem();

    const response = await request(app).get(ROUTE).send().expect(200);

    expect(response.body.length).toEqual(3);
});
