import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { DataGrid } from '@material-ui/data-grid';

import List from './List';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

const PropertyList = () => {
  const { listId } = useParams();
  const columns = [

    { field: 'thumbnail', headerName: 'Thumbnail', width: 170 },
    { field: 'address', headerName: 'Address', width: 170 },
    { field: 'details', headerName: 'Details', width: 130 },
    {
      field: 'rent',
      headerName: 'Rent',
      sortable: true,
      width: 130,
    },
    {
      field: 'rentRatio',
      headerName: 'Price-to-Rent%',
      sortable: true,
      width: 180,
    },

    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'note',
      headerName: 'Note',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (params) =>
        `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    },

  ];

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },

  ];
  

  return (
    <>
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  </>
  );
}


export default PropertyList;