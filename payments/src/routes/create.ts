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
import { stripe } from './../stripe';

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

    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    const charge = await stripe.charges.create({
      amount: existingOrder.price * 100,
      currency: 'usd',
      source: token,
      description: 'Ticket purchase',
    });

    console.log(charge);

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
