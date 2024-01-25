import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import mongoose from 'mongoose';

it('fetches the order', async () => {
    // Create a item

    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'artifact',
        finalPrice: 20,
    });

    await item.save();

    const user = global.signin();

    // make a request to build an order with this item

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(201);

    // make request to fetch the order

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tires to fetch another user order', async () => {
    // Create a item

    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'artifact',
        finalPrice: 20,
    });

    await item.save();

    const user = global.signin();

    // make a request to build an order with this item

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(201);

    // make request to fetch the order

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send({ itemId: item.id })
        .expect(401);
});
