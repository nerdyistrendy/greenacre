import React, { useState, useEffect  } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTableList from "./EnhancedTableList";
import axios from "axios";
import "./List.scss";

const List = (props) => {
  const lists = JSON.parse(localStorage.getItem('currentListsLocalStorage')||[])
  // console.log(lists)
  const listsLength = lists[0].length

  const listObjects = []
  for (let i = 0; i < listsLength ; i++) {   
    listObjects.push( {
      listName: lists[0][i],
      listId:lists[1][i],
      // action: "Delete"
      })  
  }


  const columns = React.useMemo(
    () => [
      {
        Header: 'List Name',
        accessor: 'listName',
      },
      // {
      //   Header: 'Action',
      //   accessor: 'action',
      // },
    ],
    []
  )
  

  const [data, setData] = React.useState(React.useMemo(() => listObjects, []))
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  return (
    <div>
      <CssBaseline />
      <EnhancedTableList
        columns={columns}
        data={data}
        setData={setData}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        getLists={props.getLists}
      />
    </div>
  )
}

export default List;