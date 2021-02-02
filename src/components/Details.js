import React, { useState } from 'react';

const Details = (props) => {
  return (
    <div>{props.currentProperty? props.currentProperty : "none"}</div>
  )
}

export default Details;