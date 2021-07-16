import { Publisher, Subjects, OrderCreatedEvent } from '@devdezyn/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
