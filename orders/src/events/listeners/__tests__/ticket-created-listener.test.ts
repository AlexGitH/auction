import { ItemCreatedEvent } from '@fairdeal/common';
import { natsWrapper } from '../../../nats-wrapper';
import { ItemCreatedListener } from '../item-created-listener';
import mongoose from 'mongoose';
import { Item } from '../../../models/item';

const setup = async () => {
    // create an instance of the listener
    const listener = new ItemCreatedListener(natsWrapper.client);

    // create a fake data event

    const data: ItemCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'artifact',
        startPrice: 1,
        finalPrice: 10,
        description: 'some description',
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return { listener, data, msg };
};

describe('item-created-listener', () => {
    test('creates and saves the item', async () => {
        const { listener, data, msg } = await setup();
        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertion to make sure a item was created!
        const item = await Item.findById(data.id);

        expect(item).toBeDefined();
        expect(item?.name).toEqual(data.name);
        expect(item?.finalPrice).toEqual(data.finalPrice);
    });

    test('acks the message', async () => {
        const { listener, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertion to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    });
});
