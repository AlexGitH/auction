import { Publisher, OrderCreatedEvent, Subjects } from '@fairdeal/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
