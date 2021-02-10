import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import "./List.scss";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const List = (props) => {
  const classes = useStyles();

  return (
    <div>

      <h1> My lists</h1>
      {JSON.parse(localStorage.getItem('currentListsLocalStorage')).map(function (list, index) {
      return (
        <li key={index}>
          {list}          
          </li>
      );
    })}
      <div className="fab">
      <Fab  aria-label="add" >
        <AddIcon />
      </Fab>  
      </div>
    </div>
  )
}

export default List;