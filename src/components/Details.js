import React, { useState } from "react";
import AddToListForm from "./AddToListForm"
import "./styles.scss";

const Details = (props) => {
  return (
    <div>
      <ul>
        <li>
          {props.currentProperty
            ? props.currentProperty.properties[0].property_id
            : ""}
        </li>
        <li>{props.currentProperty ? props.address : ""}</li>
        <li>
          {props.currentProperty
            ? props.currentProperty.meta.tracking_params.listingPrice
            : ""}
        </li>
        <li>
          {props.currentProperty
            ? props.currentProperty.properties[0].description
            : ""}
        </li>
        <li>{props.currentProperty
            ? <AddToListForm currentProperty={props.currentProperty}/>
            : ""}</li>  
      </ul>

    </div>
  );
};

export default Details;
