import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@devdezyn/common';
import Order from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const existingOrder = await Order.findById(req.params.orderId).populate(
      'ticket'
    );
    if (!existingOrder) {
      throw new NotFoundError();
    }

    if (existingOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(existingOrder);
  }
);

export { router as readOrderRouter };
