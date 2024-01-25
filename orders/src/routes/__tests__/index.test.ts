import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import mongoose from 'mongoose';

const buildItem = async () => {
    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'artifact',
        finalPrice: 20,
    });

    await item.save();
    return item;
};

it('fetches orders from an particular user', async () => {
    // Create 3 items

    const itemOne = await buildItem();
    const itemTwo = await buildItem();
    const itemThree = await buildItem();

    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order as User #1

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ itemId: itemOne.id })
        .expect(201);

    // Create two orders as User #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ itemId: itemTwo.id })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ itemId: itemThree.id })
        .expect(201);

    // Make request to get orders ofr User #2

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toBe(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].item.id).toEqual(itemTwo.id);
    expect(response.body[1].item.id).toEqual(itemThree.id);
});
