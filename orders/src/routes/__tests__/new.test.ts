import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Item } from '../../models/item';
import { natsWrapper } from '../../nats-wrapper';

const id = new mongoose.Types.ObjectId().toHexString();

it('returns an error if the item does not exist', async () => {
    const itemId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ itemId })
        .expect(404);
});

it('returns an error if the items is already reserved', async () => {
    const item = Item.build({
        id,
        name: 'artifact',
        finalPrice: 20,
    });

    await item.save();

    const order = Order.build({
        item,
        userId: 'askdfjlasdfkj',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });

    await order.save();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ itemId: item.id })
        .expect(400);
});

it('reserves a item', async () => {
    const item = Item.build({
        id,
        name: 'artifact',
        finalPrice: 20,
    });

    await item.save();

    const result = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ itemId: item.id })
        .expect(201);

    expect(result.body).toBeDefined();
    expect(result.body.item.id).toEqual(item.id);
});

it('emits an order created event', async () => {
    const item = Item.build({
        id,
        name: 'artifact',
        finalPrice: 20,
    });

    await item.save();

    const result = await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ itemId: item.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
