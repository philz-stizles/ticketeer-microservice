import React from 'react';
import Link from 'next/link';

const OrdersPage = ({ orders }) => {
  console.log(orders);
  const renderOrders = (orders) =>
    orders.map(({ id, status, ticket }) => {
      return (
        <tr key={id}>
          <td>{id}</td>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
          <td>{status}</td>
          <td>
            <Link href="/orders/[orderId]" as={`/orders/${id}`}>
              <a>View</a>
            </Link>
          </td>
        </tr>
      );
    });

  return (
    <div>
      <h1 className="mb-3">Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{renderOrders(orders)}</tbody>
      </table>
    </div>
  );
};

OrdersPage.getInitialProps = async (ctx, client) => {
  const { data } = await client.get(`/api/orders`);

  return {
    orders: data,
  };
};

export default OrdersPage;
