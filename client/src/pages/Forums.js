import React, { useEffect, useState } from "react";
import { ForumSearch } from '../components/ForumSearch/ForumSearch.js';
import { UserForums } from '../components/UserForums.js';
import { ThemeProvider } from '@mui/material/styles';
import forumTheme from '../components/ForumSearch/ForumTheme.js';
import config from "../config";
import axios from "axios";

function Forums() {
    const [user, setUser] = useState(null);
    const [userForums, setUserForums] = useState([]);
    const [changes, setChanges] = useState(false);
    const handleForumChange = () => {
        setChanges(!changes);
    };

    const getUser = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
            setUser(res.data.user);
        } catch (error) {
            console.log("error fetching user: ", error);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            await getUser();
        }
        fetchUserInfo();
    }, [changes]);

    useEffect(() => {
        const fetchUserForums = async () => {
            const forumData = [];
            for (let i = 0; i < user.savedForums.length; i++) {
                try {
                    const res = await axios.get(`${config.API_BASE_URL}/forum/getForum?forumId=${user.savedForums[i]}`);
                    const data = await res.data;
                    forumData.push(data);
                } catch (error) {
                    console.log("Error fetching user forums: ", error);
                }
            }
            setUserForums(forumData);
        }
        if (user != null) {
            fetchUserForums();
        }
    }, [user]);
    

    return (
        <div>
            <ThemeProvider theme={forumTheme}>
                <ForumSearch user={user} userForums={userForums} detectChange={handleForumChange}/>
                <div style={{height: "50px"}}></div>
                <UserForums user={user} userForums={userForums} onChange={handleForumChange}/>
            </ThemeProvider>
        </div>
    );
}

export default Forums;
