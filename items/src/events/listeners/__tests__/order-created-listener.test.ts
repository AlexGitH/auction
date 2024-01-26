import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@fairdeal/common';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a item
    const item = Item.build({
        name: 'artifact',
        startPrice: 99,
        finalPrice: 99,
        userId: 'aisdfas',
        description: 'test desc'
    });
    await item.save();

    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'aksdjf',
        expiresAt: 'asdfa',
        item: {
            id: item.id,
            finalPrice: item.finalPrice,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, item, data, msg };
};

it('sets the userId of the item', async () => {
    const { listener, item, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const updatedItem = await Item.findById(item.id);
    expect(updatedItem!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('published a item updated event', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const itemUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(data.id).toEqual(itemUpdatedData.orderId);
});
