import express, { Request, Response } from 'express';
import { NotFoundError } from '@devdezyn/common';
import Order from '../models/order';

const router = express.Router();

router.get('/api/tickets/:orderId', async (req: Request, res: Response) => {
  const existingOrder = await Order.findById(req.params.id);
  if (!existingOrder) {
    throw new NotFoundError();
  }

  res.send(existingOrder);
});

export { router as readOrderRouter };
