import { useEffect, useState } from "react";
import { CourseCard } from "../components/CourseCard";

async function fetchCourses(searchTerm) {
    try {
        const res = await fetch('http://localhost:5000/course', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error fetching courses: ", error);
    }
}

export default function Calendar() {
    const  [data, setData] = useState()
    useEffect(() => {
        fetchCourses("CS70000").then((response) => setData(response))
      }, [])

    return(
        <>
        <h1>calendar page test</h1>
        <CourseCard courses={data}/></>
        //search bar
        //on click button for search, call to api
        //pass results of api call to result component
        //.map use state, when user searches, fetch to backend, state changed, component will be rendered
    );
}


