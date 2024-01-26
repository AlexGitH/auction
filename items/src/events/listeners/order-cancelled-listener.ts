import { Listener, OrderCancelledEvent, Subjects } from '@fairdeal/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Item } from '../../models/item';
import ItemUpdatedPublisher from '../item-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(
        data: OrderCancelledEvent['data'],
        msg: Message
    ): Promise<void> {
        const item = await Item.findById(data.item.id);

        if (!item) {
            throw new Error('Item not found');
        }

        item.set({ orderId: undefined });
        await item.save();
        await new ItemUpdatedPublisher(this.client).publish({
            id: item.id,
            orderId: item.orderId,
            userId: item.userId,
            startPrice: item.startPrice,
            finalPrice: item.finalPrice,
            name: item.name,
            description: item.description,
            version: item.version,
        });
        msg.ack();
    }
}
