import React, { useState } from 'react';
import { useParams } from "react-router-dom";

import List from './List';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

const PropertyList = () => {
  const { listId } = useParams();


  return (
    <>
      <p>
        <strong>Match Props: </strong>
      </p>
</>
  );
}


export default PropertyList;