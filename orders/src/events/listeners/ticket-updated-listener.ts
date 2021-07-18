import { Listener, Subjects, TicketUpdatedEvent } from '@devdezyn/common';
import { Message } from 'node-nats-streaming';
import Ticket from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  //
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const existingTicket = await Ticket.findByIdAndPrevEvent(data);
    if (!existingTicket) {
      throw new Error('Ticket not found');
    }

    // Without the mongoose-update-if-current
    // const { title, price, version } = data;
    // existingTicket.set({ title, price, version });
    // await existingTicket.save();

    const { title, price } = data;
    existingTicket.set({ title, price });
    await existingTicket.save();

    msg.ack();
  }
}
