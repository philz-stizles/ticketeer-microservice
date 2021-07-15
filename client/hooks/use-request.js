import React from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState(null);

  const doRequest = async () => {
    try {
      setLoading(true);
      setErrors(null);

      const response = await axios[method](url, body);
      // console.log(response.data);
      setLoading(false);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, loading, errors };
};

export { useRequest };
