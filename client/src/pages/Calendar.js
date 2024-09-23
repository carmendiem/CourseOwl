import { CalendarView } from "../components/ScheduleCal";
import { SearchBar } from "../components/SearchBar.js"
import { useState } from "react";

export default function Calendar() {

    const [change, setChange] = useState(false);
    const toggleState = () => {
        setChange(!change);
    };

    return(
        <div style={{padding: '10px' }}>
            <SearchBar toggleState = {toggleState}/>
            <CalendarView change = {change}/>
        </div>
    );
}
