import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
} from '@devdezyn/common';
import Order from '../models/order';
// import { TicketCreatedPublisher } from '../events/publishers/order-created-publisher';
// import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

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
    const { status, ticketId } = req.body;

    const newOrder = Order.build({
      status,
      expiresAt: Date.now(),
      userId: req.currentUser!.id,
      ticketId,
    });
    await newOrder.save();
    // await new OrderCreatedPublisher(natsWrapper.client).publish({
    //   id: newOrder.id,
    //   title: newOrder.title,
    //   price: newOrder.price,
    //   userId: newOrder.userId,
    // });

    res.status(201).send(newOrder);
  }
);

export { router as createOrderRouter };
