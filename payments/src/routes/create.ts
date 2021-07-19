import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
  NotAuthorizedError,
} from '@devdezyn/common';
import Order from '../models/order';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('A token must be provided'),
    body('orderId').not().isEmpty().withMessage('An order Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    // Find the order the user is trying to pay for in the database
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      throw new NotFoundError();
    }

    // Make sure the user that placed the order is the same user that is paying for it
    if (existingOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Make sure the user that placed the order is the same user that is paying for it
    if (existingOrder.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }

    // Update order status to completed
    existingOrder.set({ status: OrderStatus.Complete });
    await existingOrder.save();

    res.status(201).send(existingOrder);
  }
);

export { router as createChargeRouter };
