import "./PostSearch.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import config from "../../config";
import axios from "axios";
import { Typography } from '@mui/material';

async function fetchPosts(searchTerm, forumId, tag) {
    try {
        const res = await axios.get(`${config.API_BASE_URL}/forum/getPost?searchTerm=${searchTerm}&forumId=${forumId}&tag=${tag}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.log("Error fetching posts: ", error);
    }
}

export function PostSearch( {forumId, setSearchedPosts, tag, searchTerm, setSearchTerm} ) {
    const [postResults, setPostResults] = useState([])
    const [searchAlert, setSearchAlert] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm); // Update debounced search term
        }, 300);  // Delay search by 300ms

        return () => {
            clearTimeout(handler);  // Cleanup the timeout if input changes
        };
    }, [searchTerm, tag]);

    // Fetch courses based on debounced search term
    useEffect(() => {
        const searchForums = async () => {
            //
            if ((debouncedTerm && debouncedTerm.trim() !== "") || (debouncedTerm && tag !== null)) {
                const results = await fetchPosts(debouncedTerm, forumId, tag);
                if (results) {
                    setSearchedPosts(results);
                    setSearchAlert("")
                } else {
                    setSearchedPosts([]);
                    setSearchAlert("No posts found that match your search, please try again!")
                }
            } else  {
                setSearchedPosts(null);
            }
        };
        searchForums();
    }, [debouncedTerm]);

    return (
            <Box className="input-wrapper">
                <input
                    placeholder="Search for posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>
    );
}