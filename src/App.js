import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  HashRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
/* Material UI imports */
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import lightGreen from '@material-ui/core/colors/red';
import { ProfileButton } from "./components/ProfileButton";
import { Login } from './components/Login';
import { Hello } from './components/Hello';
// import Hello from './components/Hello'
import Search from './components/Search'
import List from './components/List'
import AutoComplete from './components/AutoComplete'
import Details from './components/Details'
// import Login from './components/Login';
import Logout from './components/Logout';
import LoginHooks from './components/LoginHooks';
import LogoutHooks from './components/LogoutHooks';
import { createMuiTheme } from '@material-ui/core/styles';

import './App.css';

const API_URL_BASE = 'http://127.0.0.1:5000/'
const clientId = '682392515702-8073lsudamcf05clhsl95fv6f1r9636i.apps.googleusercontent.com'
axios.defaults.headers.common['X-Requested-With'] = 'XmlHttpRequest'

const useStyles = makeStyles(theme => ({
  title: {
      flexGrow: 1,
  }
}));

const ProtectedRoute = ({children, authRequired, ...rest}) => {
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
  const classes = useStyles();

  /* Is authentication required? */
  const [authRequired, setAuthRequired] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [logoutError, showLogoutError] = useState(false);

  /* For logout  */
  function handleLogout() {
      async function do_logout() {
          try {
              const result = await axios.delete('/me');
              if (result.status === 200 || result.status === 204) {
                  setAuthRequired(true);
              }
          } catch(e) {
              showLogoutError(true);
          }
      }
      do_logout();
  }

  useEffect(() => {
      async function fetchData() {
          if (!authRequired) {
              try {
                  const r = await axios.get('/me');
                  setProfilePicture(r.data.picture);
              } catch(e) {
                  if (e.response) {
                      if (e.response.status === 401) {
                          setAuthRequired(true);
                      }
                  }
              }
          } else {
              setProfilePicture(null);
          }
      };

      fetchData();
  }, [authRequired]);


  const searchPropertyById = (address) => {

    axios.get(`${API_URL_BASE}id/${address}`)
    .then((response) => {
      const results = response.data["autocomplete"][0]["mpr_id"];
      setCurrentPropertyId(results);
      console.log(results)
      return results
    })
    .then((response) => {
      axios.get(`${API_URL_BASE}details/${response}`)
      .then((response) => {
        const results = response.data;
        setCurrentProperty(results);
        console.log(results)
    })})
    .catch((error) => {
      setErrorMessage(error.message);
    });
  };
    
  return (
    <div>
       <CssBaseline />
      <AppBar position="static" style={{ background: '#8bc34a' }}>
        <Toolbar>
            <Typography color="inherit" variant="h6" className={classes.title}>
                Greenacre Hub
            </Typography>
            <ProfileButton
                handleLogout={handleLogout}
                authenticated={!authRequired}
                profilePicture={profilePicture}
                />
        </Toolbar>
      </AppBar>

    <Router>
      <div>
        <nav >
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/login'>Log in</Link>
            </li>
            <li>
              <Link to='/search'>Search</Link>
            </li>
            <li>
              <Link to='/list'>My List</Link>
            </li>
            <li>
              <Link to='/AutoComplete'>AutoComplete</Link>
            </li>
            <li>
              <Link to='/Details'>Details</Link>
            </li>
          </ul>
        </nav>
        <main>

          <section>
            <Switch>

              <Route path='/search'>
                <Search searchPropertyById={searchPropertyById}
                        currentProperty={currentProperty} 
                />
              </Route>
              <Route path='/list'>
                <List
                />
              </Route>
              <Route path='/details'>
                <Details currentProperty={currentProperty} 
                />
              </Route>
              <Route path='/AutoComplete'>
                <AutoComplete searchPropertyById={searchPropertyById}
                              currentProperty={currentProperty}
                              currentPropertyId={currentPropertyId} 
                />
              </Route>
              <Route path='/login'>
                {/* <Hello /> */}
                {/* <LoginHooks />
                <LogoutHooks /> */}
                <Login
                  authRequired={authRequired} setAuthRequired={setAuthRequired}
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                 />
              </Route>
              <ProtectedRoute authRequired={authRequired} path="/">
                <Hello setAuthRequired={setAuthRequired} />
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
}

export default App;
