import express, { Request, Response } from 'express';
import { NotFoundError } from '@devdezyn/common';
import Ticket from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  // Only show tickets that have not been ordered for, or on which orders have been cancelled
  const tickets = await Ticket.find({ orderId: undefined });

  res.send(tickets);
});

export { router as listTicketRouter };
