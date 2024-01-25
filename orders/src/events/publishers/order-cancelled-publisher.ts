import { Publisher, OrderCancelledEvent, Subjects } from '@fairdeal/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
