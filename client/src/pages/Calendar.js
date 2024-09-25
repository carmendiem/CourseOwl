import { CalendarView } from "../components/ScheduleCal";
import { SearchBar } from "../components/SearchBar.js"

export default function Calendar() {

    return(
        <div style={{padding: '10px' }}>
            <SearchBar/>
            <CalendarView/>
        </div>
    );
}
