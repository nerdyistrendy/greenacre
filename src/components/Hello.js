import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import ListAltIcon from '@material-ui/icons/ListAlt';
import SearchIcon from '@material-ui/icons/Search';
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import "./Hello.css";

const useStyles = makeStyles((theme) => ({
  content: {
    textAlign: "center",
    marginTop: 40,
  },
}));
const API_URL_BASE = "/";

export function Hello(props) {
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const classes = useStyles();
  const [authRequired, setAuthRequired] = [
    props.authRequired,
    props.setAuthRequired,
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const r = await axios.get(`${API_URL_BASE}me`);
        //r{'google_id': current_user.id,
        // 'name': current_user.name,
        // 'picture': current_user.profile_pic}
        setName(r.data.name);
        setSub(r.data.google_id);
        
      } catch (e) {
        console.log(e);
        if (e.response) {
          if (e.response.status === 401) {
            setAuthRequired(true);
          }
        }
      }
    }

    fetchData();
  }, [authRequired, setAuthRequired]);

  if (name && sub)
    return (
      <div className={classes.content}>
        <p className="welcome">Welcome, {name}</p>
        <Typography variant="body1">Google subscriber ID: {sub}.</Typography>
        <section className="icons">
        <p><Link to="/list" ><ListAltIcon style={{ fontSize: 50 }}/></Link></p>
        <p><Link to="/Autocomplete" ><SearchIcon style={{ fontSize: 50 }}/></Link></p>
        </section>
      </div>
    );
  else
    return (
      <div className={classes.content}>
        <Typography variant="h5">Loading...</Typography>
      </div>
    );
}
export default Hello;
