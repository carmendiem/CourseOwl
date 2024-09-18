import React from "react";
import { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

export function CalendarView() {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timesOfDay = ["6am", "7am","8am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"]
    // const [startDate, setStartDate] = useState(DayPilot.Date.today());
    const [config, setConfig] = useState({
        viewType: "Resources",
        columns: [
          { name: "Monday", id: "M" },
          { name: "Tuesday", id: "T" },
          { name: "Wednesday", id: "W" },
          { name: "Thursday", id: "H" },
          { name: "Friday", id: "F" },
        ]
        
      });

    return (
        <div>
            <div style={{height: '700px'}}> 
                <DayPilotCalendar
                    {...config}
                    height="Parent100Pct"

                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>

                {daysOfWeek.map((day, i) => (
                    <div style={{
                        flex: 1,
                        margin: '10px',
                        // height: '800px',
                        textAlign: 'center',
                        border: '1px solid #ddd',
                        padding: '10px',
                        backgroundColor: '#e0f7fa',
                    }}>
                        <h1>{day}</h1>
                        <div style={{textAlign: 'left'}}>
                            {timesOfDay.map((time) => (
                                <div>
                                    {time}
                                </div>
                            ))}
                        </div>    
                    </div>
                    
                ))}
            </div>
        </div>
        
    );

}