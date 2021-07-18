import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderStatus,
} from '@devdezyn/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import Order from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  //
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, ticket } = data;

    // Find the ticket that the order is reserving
    const existingOrder = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    // If the Ticket is not found, throw an error
    if (!existingOrder) {
      throw new Error('Order not found');
    }
    // Update the Ticket's orderId to indicate that it is reserved
    existingOrder.set({ status: OrderStatus.Cancelled });
    await existingOrder.save();

    msg.ack();
  }
}
