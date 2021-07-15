import React from 'react';

const Index = ({ currentUser }) => {
  console.log('client', currentUser);
  return (
    <div className="container">
      {currentUser === null ? (
        <h1>You are NOT signed in</h1>
      ) : (
        <h1>You are signed in</h1>
      )}
    </div>
  );
};

export default Index;
