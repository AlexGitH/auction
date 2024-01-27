import { PaymentCreatedEvent, Publisher, Subjects } from '@fairdeal/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
