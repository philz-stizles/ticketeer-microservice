import { Schema, Model, model, Document } from 'mongoose';

// Create an interface.
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a Ticket Model has
interface TicketModel extends Model<TicketDocument> {
  build(attrs: TicketAttrs): TicketDocument;
}

// An interface that describes the properties that a Ticket Document has
interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// Create a Model.
const Ticket = model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export default Ticket;
