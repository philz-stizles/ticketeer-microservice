import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@devdezyn/common';
import { Message } from 'node-nats-streaming';
import Order from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  //
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    // Find the expired order
    const expiredOrder = await Order.findById(data.orderId).populate('ticket');
    if (!expiredOrder) {
      throw new Error('Order not found');
    }

    // Ensure that you do not cancel an order that is completed
    if (expiredOrder.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // Expire the order by updating the status to cancelled
    expiredOrder.set({ status: OrderStatus.Cancelled });
    await expiredOrder.save();

    // Publish an event saying this was cancelled
    await new OrderCancelledPublisher(this.client).publish({
      id: expiredOrder.id,
      version: expiredOrder.version,
      ticket: {
        id: expiredOrder.ticket.id,
      },
    });

    msg.ack();
  }
}
