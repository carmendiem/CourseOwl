import './App.css';
import { Rout } from "../src/routers/Routes";
import { Navbar } from './components/Navbar';

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from './config.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/user`, { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <div>
      {/* Add the navbar component */}
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      {/* Main content wrapper */}
      <div style={{ marginLeft: '100px', padding: '20px' }}>
        <Rout setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

export default App;
