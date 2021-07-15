import React from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/use-request';

const Signout = () => {
  const { doRequest, loading, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  React.useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out ...</div>;
};

export default Signout;
