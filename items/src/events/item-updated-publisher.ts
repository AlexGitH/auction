import { Publisher, Subjects, ItemUpdatedEvent } from '@fairdeal/common';

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
    subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
}

export default ItemUpdatedPublisher;
