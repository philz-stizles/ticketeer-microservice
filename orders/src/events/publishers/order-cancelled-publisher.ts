import { Publisher, Subjects, OrderCancelledEvent } from '@devdezyn/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
