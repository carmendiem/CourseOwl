import { Route, Routes } from "react-router-dom";
import { Calendar } from "../pages/Calendar";
import { HomePage } from "../pages/HomePage";

export function Rout(){
    return (
        <Routes>
          <Route path="/example" element={<Calendar />} />
          <Route path="" element={<HomePage />} />
        </Routes>
      );
}