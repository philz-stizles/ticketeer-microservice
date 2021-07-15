import { Schema, Model, model, Document } from 'mongoose';

// Create an interface.
interface OrderAttrs {
  status: string;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

// An interface that describes the properties that a Order Model has
interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttrs): OrderDocument;
}

// An interface that describes the properties that a Order Document has
interface OrderDocument extends Document {
  status: string;
  expiresAt: Date;
  userId: string;
  ticket: TicketDoc;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const orderSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['expires', 'paid', 'pending'],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    ticket: {
      type: String,
      required: true,
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

export default Order;
