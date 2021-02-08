import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddToListForm from "./AddToListForm"
import axios from "axios";

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

  const [currentUser, setCurrentUser] = [
    props.currentUser,
    props.setCurrentUser,
  ];

  const onTrigger = (r) => {
    props.getLists(r);
}

  useEffect(() => {
    async function fetchData() {
      try {
        const r = await axios.get(`${API_URL_BASE}me`);
        //r{'google_id': current_user.id,
        // 'name': current_user.name,
        // 'picture': current_user.profile_pic}
        onTrigger(r.data);
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
        <Typography variant="h4">Hello, {name}</Typography>
        <Typography variant="body1">
          Click your profile picture to log out.
        </Typography>
        <Typography variant="body1">Google subscriber ID: {sub}.</Typography>
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
