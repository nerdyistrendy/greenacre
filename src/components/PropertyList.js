import React, { useState } from 'react';
import Details from './Details';

const PropertyList = ({ match, location }) => {
  
  
  return (
    <>
      <p>
        <strong>Match Props: </strong>
        <code>{JSON.stringify(match, null, 2)}</code>
      </p>
      <p>
        <strong>Location Props: </strong>
        <code>{JSON.stringify(location, null, 2)}</code>
      </p>
    </>
  );
}


export default PropertyList;