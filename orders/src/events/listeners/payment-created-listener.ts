import {
    Listener,
    OrderStatus,
    PaymentCreatedEvent,
    Subjects,
} from '@fairdeal/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        // in scope of app the Order in status complete will never updates its version
        order.set({
            status: OrderStatus.Complete,
        });

        // TODO: of course it is ideally to create order-updated publisher to inform all others about order change
        await order.save();

        msg.ack();
    }
}
