import { Listener, Subjects, ItemUpdatedEvent } from '@fairdeal/common';
import { Message } from 'node-nats-streaming';
import { Item } from '../../models/item';
import { queueGroupName } from './queue-group-name';

export class ItemUpdatedListener extends Listener<ItemUpdatedEvent> {
    subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ItemUpdatedEvent['data'], msg: Message) {
        const item = await Item.findByEvent(data);

        if (!item) {
            throw new Error('Item not found');
        }

        const { name, finalPrice } = data;

        item.set({ name, finalPrice });

        await item.save();

        msg.ack();
    }
}
