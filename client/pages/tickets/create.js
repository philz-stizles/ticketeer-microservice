import React from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const TicketCreatePage = () => {
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState('');
  const { doRequest, loading, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const onBlur = async () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title">Title</label>
          <input
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price">Price</label>
          <input
            className="form-control"
            id="price"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TicketCreatePage;
