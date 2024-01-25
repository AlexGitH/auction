import { Listener, Subjects, ItemCreatedEvent } from '@fairdeal/common';
import { Message } from 'node-nats-streaming';
import { Item } from '../../models/item';
import { queueGroupName } from './queue-group-name';

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
    subject: Subjects.ItemCreated = Subjects.ItemCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ItemCreatedEvent['data'], msg: Message) {
        const { id, name, finalPrice } = data;

        const item = Item.build({
            id,
            name,
            finalPrice,
        });

        await item.save();

        msg.ack();
    }
}
