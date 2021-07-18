import { Listener, Subjects, OrderCreatedEvent } from '@devdezyn/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milliseconds to process the Job`);

    // save orderId to expiration queue
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    // Acknowledge the message
    msg.ack();
  }
}
