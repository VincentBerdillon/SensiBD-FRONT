import React from 'react';
import { Bars } from 'react-loader-spinner';

//* Composant loader de React

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Bars
        height="80"
        width="80"
        color="#95c23d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible
      />
    </div>
  );
}

export default Loader;
