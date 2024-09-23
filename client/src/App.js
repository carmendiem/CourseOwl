import './App.css';
import { Rout } from "../src/routers/Routes";
import { Navbar } from './components/Navbar';

import {React, useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      axios.get('http://localhost:5001/user', { withCredentials: true })
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
          <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          {/* <Rout/> */}
          {/* Pass setIsLoggedIn and isLoggedIn here */}
          <Rout setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </div>
  );
}

export default App;