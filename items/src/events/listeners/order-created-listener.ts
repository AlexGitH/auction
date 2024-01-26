import { Listener, OrderCreatedEvent, Subjects } from '@fairdeal/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Item } from '../../models/item';
import ItemUpdatedPublisher from '../item-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(
        data: OrderCreatedEvent['data'],
        msg: Message
    ): Promise<void> {
        // Find the item that the order is reserving
        const item = await Item.findById(data.item.id);

        console.log(item);

        // If no item, throw error
        if (!item) {
            throw new Error('Item not found');
        }

        // Mark the item as being reserved by setting its orderId properly
        item.set({ orderId: data.id });

        // Save the item
        await item.save();
        new ItemUpdatedPublisher(this.client).publish({
            id: item.id,
            startPrice: item.startPrice,
            finalPrice: item.finalPrice,
            name: item.name,
            userId: item.userId,
            orderId: item.orderId,
            description: item.description,
            version: item.version,
        });

        // Ack the message
        msg.ack();
    }
}
