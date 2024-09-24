import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../components/Login";
import Signup from "../components/Signup";

export function Rout({ setIsLoggedIn, isLoggedIn }){
    return (
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      );
}