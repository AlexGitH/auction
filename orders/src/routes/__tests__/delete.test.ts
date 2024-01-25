import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const id = new mongoose.Types.ObjectId().toHexString();

it('mark an order as canscelled', async () => {
    //create a item with Item model
    const item = Item.build({
        id,
        name: 'item1',
        finalPrice: 20,
    });

    await item.save();

    const user = global.signin();

    // make a request to create an order

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(201);

    // make a request to cancel an order

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    // expectation to make sure things is cancelled

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    //create a item with Item model
    const item = Item.build({
        id,
        name: 'item1',
        finalPrice: 20,
    });

    await item.save();

    const user = global.signin();

    // make a request to create an order

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ itemId: item.id })
        .expect(201);

    // make a request to cancel an order

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
