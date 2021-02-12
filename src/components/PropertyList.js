import React, { useState, PureComponent } from 'react';
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import differenceBy from 'lodash/differenceBy';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import memoize from 'memoize-one';
import CustomMaterialMenu from './CustomMaterialMenu';
import movies from "./movies";
import TextField from "@material-ui/core/TextField";
import { createTheme } from 'react-data-table-component';
import "./styles.scss";

import List from './List';
import { Link, BrowserRouter as Router, Route } from "react-router-dom";
createTheme('green', {
  // text: {
  //   primary: '#268bd2',
  //   secondary: '#2aa198',
  // },
  // background: {
  //   default: '#002b36',
  // },
  // context: {
  //   background: '#cb4b16',
  //   text: '#FFFFFF',
  // },
  // divider: {
  //   default: '#073642',
  // },
  // action: {
  //   button: 'rgba(0,0,0,.54)',
  //   hover: 'rgba(0,0,0,.08)',
  //   disabled: 'rgba(0,0,0,.12)',
  // },

});

const sortIcon = <ArrowDownward />;
const selectProps = { indeterminate: isIndeterminate => isIndeterminate };
const actions = (
  <IconButton
    color="primary"
  >
    <Link to="/AutoComplete"><Add /></Link>
  </IconButton>
);
const contextActions = memoize(deleteHandler => (
  <IconButton
    color="secondary"
    onClick={deleteHandler}
  >
    <Delete />
  </IconButton>


));


const PropertyList = () => {
  const { listId } = useParams();
  const [rows, setRows] = React.useState(movies);
  const [rent, setRent] = React.useState("");
  const [note, setNote] = React.useState("");
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [toggleCleared, setToggleCleared] = React.useState(false);

  const columns = React.useMemo((deleteHandler) => {
    const handleAction = event => setRent(event.target.value);
    const handleAction2 = event => setNote(event.target.value);
    return [
      {
        cell: row => <CustomMaterialMenu row={row} onDeleteRow={deleteHandler} />,
        allowOverflow: true,
        button: true,
        width: '56px', // custom width for icon button
      },
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
        name: "Price",
        selector: "price",
        sortable: true,
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
    ]
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
  
  const handleChange = () => {
     setSelectedRows(selectedRows) };


  const handleRowClicked = row => {
    
    console.log(`${row.name} was clicked!`);
  }

  const deleteAll = () => {
    const rows = selectedRows.map(r => r.name);
    
    if (window.confirm(`Are you sure you want to delete:\r ${rows}?`)) {
      setRows(differenceBy(rows, selectedRows, 'name'));
      setToggleCleared(!toggleCleared);
    }
  }

  const deleteOne = row => {
    
    if (window.confirm(`Are you sure you want to delete:\r ${row.name}?`)) {
      const index = rows.findIndex(r => r === row);
      setToggleCleared(!toggleCleared);
      setRows([...rows.slice(0, index), ...rows.slice(index + 1)]);
    }
  }


  return (
    <Card style={{ height: '100%' }}>

    <div className="PropertyList">
      <DataTable
        title="Properties"
        columns={columns}
        data={rows}
        defaultSortField="title"
        selectableRows
        highlightOnHover
        actions={actions}
        contextActions={contextActions(deleteAll)}
        sortIcon={sortIcon}
        selectableRowsComponent={Checkbox} 
        selectableRowsComponentProps={selectProps}
        onSelectedRowsChange={handleChange}
        clearSelectedRows={toggleCleared}
        onRowClicked={handleRowClicked}
        pagination
        expandableRows
        theme="green"

      />
    </div>
    </Card>
  );
}


export default PropertyList;