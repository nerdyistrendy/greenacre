import React, { useState } from "react";
import AddToListForm from "./AddToListForm"
import CurrencyFormat from 'react-currency-format';
import "./Details.css";

const Details = (props) => {
  return (
    <div className='container'>
      <ul className='flex-item'>
      <li>
          {props.currentProperty
            ? <img src={props.currentProperty.properties[0].photos[0]["href"]} alt="thumbnail" width = '90%' />
            : ""}
        </li>
        <li>
          {props.currentProperty
            ? props.currentProperty.meta.tracking_params.mprId
            : ""}
        </li>
        <li>{props.currentProperty ? props.address : ""}</li>
        <li>
          {props.currentProperty
            ? <CurrencyFormat value={props.currentProperty.meta.tracking_params.listingPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />            
            : ""}
        </li>
        <li>
          {props.currentProperty
            ? props.currentProperty.properties[0].description
            : ""}
        </li>
        <li>{props.currentProperty
            ? <AddToListForm currentProperty={props.currentProperty} currentUser={props.currentUser} currentUserLists={props.currentUserLists} addPropertyToList={props.addPropertyToList} getLists={props.getLists} address={props.address}/>
            : ""}</li>  
      </ul>

    </div>
  );
};

export default Details;
