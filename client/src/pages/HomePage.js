import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { SearchBar } from "../components/SearchBar.js"
import { CalendarView } from "../components/ScheduleCal";
import config from '../config';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (!user) {
            axios.get(`${config.API_BASE_URL}/user/`, { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    return (
        <><SearchBar />
        {/* <center>
            <h1 style={{ color: "white", fontSize: "5rem" }}>Welcome Home {user && user.name} !!!</h1>
        </center> */}
        <CalendarView/>
        </>
    );
}

export default Home;
