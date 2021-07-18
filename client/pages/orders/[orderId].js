import React from 'react';

const OrderDetailPage = ({ order }) => {
  return <div></div>;
};

OrderDetailPage.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    order: data,
  };
};

export default OrderDetailPage;
