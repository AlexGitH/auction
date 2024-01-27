import { Listener, OrderCreatedEvent, Subjects } from '@fairdeal/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            finalPrice: data.item.finalPrice,
            status: data.status,
            userId: data.userId,
            version: data.version,
        });
        await order.save();

        msg.ack();
    }
}
