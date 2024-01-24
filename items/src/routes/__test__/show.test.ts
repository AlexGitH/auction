import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const ROUTE = '/api/items';

it('returns a 404if the item is no found', async () => {
    // id should be a valid _id for mongo(12 or 24 hex string)
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`${ROUTE}/${id}`).send().expect(404);
});

it('returns the item if it is found', async () => {
    const name = 'artifact';
    const startPrice = 20;
    const description = 'text';

    const response = await request(app)
        .post(ROUTE)
        .set('Cookie', global.signin())
        .send({
            name,
            startPrice,
            description,
        })
        .expect(201);

    const itemResponse = await request(app)
        .get(`${ROUTE}/${response.body.id}`)
        .send()
        .expect(200);

    expect(itemResponse.body.name).toEqual(name);
    expect(itemResponse.body.startPrice).toEqual(startPrice);
    expect(itemResponse.body.description).toEqual(description);
});
