import { Listener, Subjects, OrderCreatedEvent } from '@devdezyn/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, status, userId, version, ticket } = data;

    // Create new order for the Payments service
    const newOrder = Order.build({
      id,
      status,
      userId,
      price: ticket.price,
      version,
    });
    await newOrder.save();

    // Acknowledge the message
    msg.ack();
  }
}
