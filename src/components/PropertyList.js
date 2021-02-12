import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
import movies from "./movies";
import TextField from "@material-ui/core/TextField";
import "./styles.scss";

import List from './List';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";





const PropertyList = () => {
  const { listId } = useParams();
  
  const [rows, setRows] = React.useState(movies);
  const [rent, setRent] = React.useState("");
  const [note, setNote] = React.useState("");
  const columns = React.useMemo(() => {
    const handleAction = event => setRent(event.target.value);
    const handleAction2 = event => setNote(event.target.value);
    return [
      {
        name: "Thumbnail",
        selector: "Thumbnail",
        sortable: false
      },
      {
        name: "Address",
        selector: "address",
        sortable: false,
      },
      {
        name: "Details",
        selector: "details",
        sortable: false,
      },
      {
        name: "Rent",
        selector: "rent",
        sortable: true,
        cell: () => (
          <TextField variant="outlined" value={rent} onChange={handleAction} />
        )
      },
      {
        name: "Price-to-Rent%",
        selector: "rentRatio",
        sortable: true
      },
      {
        name: "Note",
        selector: "note",
        sortable: false,
        cell: () => (
          <TextField variant="outlined" value={note} onChange={handleAction2} />
        )
      },

    ];
  }, [rent, note, setRent, setNote]);


  const handleSelected = row => {
    setRows(
      movies.map(m => {
        // if (m.id === row) {
        return { ...m, expanded: true };
        // }

        // return m;
      })
    );
  };

  return (
    <div className="PropertyList">
      <DataTable
        title="Properties"
        columns={columns}
        data={rows}
        defaultSortField="title"
        pagination
        selectableRows
        expandableRows
        defaultExpandedField="expanded"
        onRowClicked={handleSelected}
      />
    </div>
  );
}


export default PropertyList;