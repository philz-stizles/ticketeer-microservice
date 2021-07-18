import React from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const TicketDetailPage = ({ ticket }) => {
  const { doRequest, loading, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => {
      // console.log(order);
      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button
        type="button"
        onClick={async () => await doRequest()}
        className="btn btn-primary"
      >
        Purchase
      </button>
    </div>
  );
};

TicketDetailPage.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return {
    ticket: data,
  };
};

export default TicketDetailPage;
