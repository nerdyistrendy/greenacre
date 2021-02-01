import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './components/Home'
import Search from './components/Search'
import Details from './components/Details'

import './App.css';

const API_URL_BASE = 'http://localhost:3000/'


const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);

  const searchProperty = (property_id) => {
    axios.get(`${API_URL_BASE}details/${property_id}`)
    .then((response) => {
      const results = response.data;
      setCurrentProperty(results);
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });
  };

  return (
    <Router>
      <div>
        <nav >
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/search'>Search</Link>
            </li>
            <li>
              <Link to='/details'>Details</Link>
            </li>
          </ul>
        </nav>
        <main>

          <section>
            <Switch>
              <Route path='/search'>
                <Search 
                />
              </Route>
              <Route path='/details'>
                <Details                   
                />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </section>

        </main>
      </div>
    </Router>

  );
}

export default App;
