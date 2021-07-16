import { Schema, Model, model, Document } from 'mongoose';
import { OrderStatus } from '@devdezyn/common';
import { TicketDocument } from './ticket';

// Create an interface.
interface OrderAttrs {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDocument;
}

// An interface that describes the properties that a Order Document has
interface OrderDocument extends Document {
  status: OrderStatus;
  expiresAt: Date;
  userId: string;
  ticket: TicketDocument;
}

// An interface that describes the properties that a Order Model has
interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

// Create a Model.
const Order = model<OrderDocument, OrderModel>('Order', orderSchema);

export { OrderStatus };
export default Order;
