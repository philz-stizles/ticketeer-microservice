import express, { Request, Response } from 'express';
import { NotFoundError } from '@devdezyn/common';
import Order from '../models/order';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  const orders = await Order.find({});

  res.send(orders);
});

export { router as listOrderRouter };
