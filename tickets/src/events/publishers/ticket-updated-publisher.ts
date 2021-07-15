import { Publisher, Subjects, TicketUpdatedEvent } from '@devdezyn/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
