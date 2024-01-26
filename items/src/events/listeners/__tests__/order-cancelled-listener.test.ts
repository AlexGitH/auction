import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@fairdeal/common';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create and save a item
    const item = Item.build({
        name: 'artifact',
        startPrice: 99,
        finalPrice: 99,
        userId: 'aisdfas',
        description: 'test desc'
    });
    item.set({ orderId });

    await item.save();

    // Create the fake data event
    const data: OrderCancelledEvent['data'] = {
        id: item.id,
        version: 0,
        item: {
            id: item.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, item, data, msg };
};

it('updates the item, publishes an event, and acks the message', async () => {
    const { msg, data, item, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedItem = await Item.findById(item.id);
    expect(updatedItem?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
