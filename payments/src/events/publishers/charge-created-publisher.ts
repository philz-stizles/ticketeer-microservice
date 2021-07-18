import { Publisher, Subjects, TicketCreatedEvent } from '@devdezyn/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
