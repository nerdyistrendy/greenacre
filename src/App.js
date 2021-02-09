import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Redirect } from "react-router-dom";
/* Material UI imports */
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Snackbar,
  Button,
  Menu,
  Fade,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Alert from "@material-ui/lab/Alert";
import { ProfileButton } from "./components/ProfileButton";
import { Login } from "./components/Login";
import { Hello } from "./components/Hello";
import AddToListForm from "./components/AddToListForm";
import Search from "./components/Search";
import List from "./components/List";
import AutoComplete from "./components/AutoComplete";
import Details from "./components/Details";
// import Login from './components/Login';
import Logout from "./components/Logout";
import LoginHooks from "./components/LoginHooks";
import LogoutHooks from "./components/LogoutHooks";
import { createMuiTheme } from "@material-ui/core/styles";

import "./App.css";

const API_URL_BASE = "/";

const clientId =
  "682392515702-8073lsudamcf05clhsl95fv6f1r9636i.apps.googleusercontent.com";
axios.defaults.headers.common["X-Requested-With"] = "XmlHttpRequest";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const ProtectedRoute = ({ children, authRequired, ...rest }) => {
  return (
    <Route {...rest}>
      {!authRequired ? children : <Redirect to="/login" />}
    </Route>
  );
};
const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserLists, setCurrentUserLists] = useState([]);

  const classes = useStyles();

  /* Is authentication required? */
  const [authRequired, setAuthRequired] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [logoutError, showLogoutError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  /* For logout  */
  function handleLogout() {
    async function do_logout() {
      try {
        const result = await axios.delete(`${API_URL_BASE}me`);
        if (result.status === 200 || result.status === 204) {
          setAuthRequired(true);
        }
      } catch (e) {
        showLogoutError(true);
      }
    }
    do_logout();
  }

  useEffect(() => {
    async function fetchData() {
      if (!authRequired) {
        try {
          const r = await axios.get(`${API_URL_BASE}me`);
          setProfilePicture(r.data.picture);
          setCurrentUser(r.data)
        } catch (e) {
          if (e.response) {
            if (e.response.status === 401) {
              setAuthRequired(true);
            }
          }
        }
      } else {
        setProfilePicture(null);
      }
    }
    fetchData();
  }, [authRequired]);

  const searchPropertyById = (address) => {
    axios
      .get(`${API_URL_BASE}id/${address}`)
      .then((response) => {
        const results = response.data["autocomplete"][0]["mpr_id"];
        setCurrentPropertyId(results);
        console.log(results);
        return results;
      })
      .then((response) => {
        axios.get(`${API_URL_BASE}details/${response}`).then((response) => {
          const results = response.data;
          setCurrentProperty(results);
          console.log(results);
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const getLists = (currentUser) => {
    axios.get(`${API_URL_BASE}${currentUser.google_id}`)
    .then((response) => {
      const results = response.data["message"];
      setCurrentUserLists(results);
      console.log(results);
      return results;
    });
  };

  const addPropertyToList = (currentUser, currentList, currentProperty) => { 
    axios.post(`${API_URL_BASE}${currentUser.google_id}/${currentList}/${currentProperty.meta.tracking_params.mprId}`)
    console.log(currentUser)
    console.log(currentList)
    console.log(currentProperty)
    .then((response) => {
      console.log(response);
      return(response)
      // const results = response.data["message"];
      // console.log(results);
      setErrorMessage('');
    })
    .catch((error) => {
      // What should we do when we know the post request failed?
      setErrorMessage(error.message);
    });
    }
  


  return (
    <div>
      <CssBaseline />
      <Router>
        <div>
          <AppBar position="static" style={{ background: "#8bc34a" }}>
            <Toolbar>
              <Typography
                color="inherit"
                variant="h6"
                className={classes.title}
              >
                Greenacre Hub
              </Typography>
              <ProfileButton
                handleLogout={handleLogout}
                authenticated={!authRequired}
                profilePicture={profilePicture}
              />
            </Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <Button
                aria-controls="fade-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                Menu
              </Button>
              <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleClose}>
                  <Link to="/">Home</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/list">My List</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/AutoComplete">Search</Link>
                </MenuItem>
              </Menu>
            </IconButton>
          </AppBar>

          <main>
            <section>
              <Switch>
                <Route path="/search">
                  <Search
                    searchPropertyById={searchPropertyById}
                    currentProperty={currentProperty}
                  />
                </Route>
                <Route path="/list">
                  <List />
                </Route>
                <Route path="/details">
                  <Details currentProperty={currentProperty} />
                </Route>
                <Route path="/AutoComplete">
                  <AutoComplete
                    searchPropertyById={searchPropertyById}
                    currentProperty={currentProperty}
                    currentPropertyId={currentPropertyId}
                    currentUser={currentUser}
                    getLists={getLists}
                    currentUserLists={currentUserLists}
                    addPropertyToList={addPropertyToList} 
                  />
                </Route>
                <Route path="/login">
                  {/* <Hello /> */}
                  {/* <LoginHooks />
                <LogoutHooks /> */}
                  <Login
                    authRequired={authRequired}
                    setAuthRequired={setAuthRequired}
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  />
                </Route>
                <ProtectedRoute authRequired={authRequired} path="/">
                  <Hello
                    setAuthRequired={setAuthRequired}
                  />
                </ProtectedRoute>
              </Switch>
            </section>
          </main>
        </div>
      </Router>

      <Snackbar
        open={logoutError}
        autoHideDuration={10000}
        onClose={() => showLogoutError(false)}
      >
        <Alert variant="filled" elevated={6} severity="error">
          Couldn't log out
        </Alert>
      </Snackbar>
      {/* <div className="App">
      <h2>The Components way</h2>
      <Login />
      <br />
      <Logout />

    </div> */}
    </div>
  );
};

export default App;
