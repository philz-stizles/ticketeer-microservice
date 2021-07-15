import express, { Request, Response } from 'express';
import { NotFoundError } from '@devdezyn/common';
import Ticket from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const existingTicket = await Ticket.findById(req.params.id);
  if (!existingTicket) {
    throw new NotFoundError();
  }

  res.send(existingTicket);
});

export { router as readTicketRouter };
