import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/create';
import { readTicketRouter } from './routes/read';
import { listTicketRouter } from './routes/list';
import { updateTicketRouter } from './routes/update';
import { currentUser, errorHandler, NotFoundError } from '@devdezyn/common';

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(
  cookieSession({
    // name: 'session',
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(readTicketRouter);
app.use(listTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
