import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@devdezyn/common';
import Order from '../models/order';
import Ticket from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const existingTicket = await Ticket.findById(ticketId);
    if (!existingTicket) {
      throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved
    const isReserved = await existingTicket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const newOrder = Order.build({
      status: OrderStatus.Created,
      expiresAt,
      userId: req.currentUser!.id,
      ticket: existingTicket,
    });
    await newOrder.save();

    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: newOrder.id,
      version: newOrder.version,
      status: newOrder.status,
      expiresAt: newOrder.expiresAt.toISOString(),
      userId: newOrder.userId,
      ticket: {
        id: existingTicket.id,
        price: existingTicket.price,
      },
    });

    res.status(201).send(newOrder);
  }
);

export { router as createOrderRouter };
