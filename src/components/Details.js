import React, { useState } from 'react';

const Details = (props) => {
  return (
    <div>{props.currentProperty ? props.currentProperty.properties[0].description: ""}</div>
  )
}

export default Details;