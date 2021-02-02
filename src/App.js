import React, { useState } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './components/Home'
import Search from './components/Search'
import List from './components/List'
import AutoComplete from './components/AutoComplete'

import './App.css';

const API_URL_BASE = 'http://127.0.0.1:5000/'


const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);


  const searchPropertyByAddress = (property_id) => {
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
              <Link to='/list'>My List</Link>
            </li>
            <li>
              <Link to='/AutoComplete'>AutoComplete</Link>
            </li>
          </ul>
        </nav>
        <main>

          <section>
            <Switch>
              <Route path='/search'>
                <Search searchPropertyByAddress={searchPropertyByAddress}
                        currentProperty={currentProperty} 
                />
              </Route>
              <Route path='/list'>
                <List
                />
              </Route>
              <Route path='/AutoComplete'>
                <AutoComplete
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
