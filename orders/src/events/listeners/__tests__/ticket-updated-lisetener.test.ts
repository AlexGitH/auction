import mongoose from 'mongoose';
import { Item } from '../../../models/item';
import { natsWrapper } from '../../../nats-wrapper';
import { ItemUpdatedListener } from '../item-updated-listener';
import { ItemUpdatedEvent } from '@fairdeal/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create a listener
    const listener = new ItemUpdatedListener(natsWrapper.client);

    // Create and save a item
    const item = Item.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'item1',
        finalPrice: 20,
    });

    await item.save();

    // Create a fake data object
    const data: ItemUpdatedEvent['data'] = {
        id: item.id,
        version: item.version + 1,
        name: 'new item',
        startPrice: 999,
        finalPrice: 999,
        description: 'some description',
        userId: 'aksdlfj',
    };

    // Create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    // return all of this stuff

    return { listener, item, data, msg };
};

describe('item-updated-listener', () => {
    test('finds, updates and save the item', async () => {
        const { listener, item, data, msg } = await setup();

        await listener.onMessage(data, msg);

        const updatedItem = await Item.findById(item.id);

        expect(updatedItem?.name).toEqual(data.name);
        expect(updatedItem?.finalPrice).toEqual(data.finalPrice);
        expect(updatedItem?.version).toEqual(data.version);
    });

    test('acks the message', async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });

    test('does not call ack if the event has a skipped version', async () => {
        const { listener, data, msg } = await setup();

        data.version = 10;

        try {
            await listener.onMessage(data, msg);
        } catch (err) {}

        expect(msg.ack).not.toHaveBeenCalled();
    });
});
