import { Publisher, Subjects, ItemCreatedEvent } from '@fairdeal/common';

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
    subject: Subjects.ItemCreated = Subjects.ItemCreated;
}

export default ItemCreatedPublisher;
