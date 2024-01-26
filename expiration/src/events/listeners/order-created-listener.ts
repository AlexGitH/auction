import { Listener, OrderCreatedEvent, Subjects } from '@fairdeal/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        let delay;
        try {
            delay = new Date(data?.expiresAt).getTime() - new Date().getTime();
            console.log(
                '++++++++++++++++++++++ Waiting this. many milliseconds to process the job:',
                delay
            );
        } catch (err) {
            console.log('!!!!!!!!!!!!!!!', err);
        }

        await expirationQueue.add(
            {
                orderId: data.id,
            },
            {
                delay,
            }
        );

        msg.ack();
    }
}
