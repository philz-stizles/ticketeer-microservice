import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@devdezyn/common';
import Ticket from '../models/ticket';
import { TicketUpdatedPublisher } from './../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than zero(0)'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const existingTicket = await Ticket.findById(req.params.id);
    if (!existingTicket) {
      throw new NotFoundError();
    }

    if (existingTicket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    if (existingTicket.title !== title) {
      const duplicateTicket = await Ticket.findOne({ title });
      if (duplicateTicket) {
        throw new BadRequestError('Ticket with that title already exists');
      }
    }

    // const ticketUpdates = { price };
    // if (existingTicket.title !== title) {
    //   ticketUpdates.title = title;
    // }

    existingTicket.set({
      title: existingTicket.title === title ? title : title,
      price,
    });

    await existingTicket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: existingTicket.id,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
    });

    res.send(existingTicket);
  }
);

export { router as updateTicketRouter };
