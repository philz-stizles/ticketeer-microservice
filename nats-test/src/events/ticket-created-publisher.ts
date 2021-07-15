import { Publisher } from './base-publisher';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
