import "./ForumSearch.css";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import config from "../../config";
import axios from "axios";
import { ForumCard } from "./ForumCard";
import { ForumSwiperComponent } from "./ForumSwiper";
import { Typography } from '@mui/material';

async function fetchForums(searchTerm) {
    try {
        const res = await axios.get(`${config.API_BASE_URL}/forum/getForumSearch?searchTerm=${searchTerm}`);
        const data = await res.data;

        return data;
    } catch (error) {
        console.log("Error fetching forums: ", error);
    }
}

export function ForumSearch() {
    const [forumResults, setForumResults] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAlert, setSearchAlert] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm); // Update debounced search term
        }, 300);  // Delay search by 300ms

        return () => {
            clearTimeout(handler);  // Cleanup the timeout if input changes
        };
    }, [searchTerm]);

    // Fetch courses based on debounced search term
    useEffect(() => {
        const searchForums = async () => {
            if (debouncedTerm && debouncedTerm.trim() !== "") {
                const results = await fetchForums(debouncedTerm);
                if (results) {
                    setForumResults(results);
                    console.log(results);
                    setSearchAlert("No forums found that match your search, please try again!")
                } else {
                    setForumResults([]);
                    setSearchAlert("")
                }
            } else {
                setForumResults([]);
                setSearchAlert("")
            }
        };

        searchForums();
    }, [debouncedTerm]);

    return (
        <>
        <Typography variant="h2" component="h2" style={{color: '#daaa00'}}>
            Forum Search
        </Typography>
        <Box className="search-container">
            <Box className="input-wrapper">
                <input
                    placeholder="Search for forums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>
            </Box>
            <div className="results-container" style={{ marginInline: "auto", maxWidth: "95%" }} >
                {forumResults && forumResults.length > 0 ? (
                    <ForumSwiperComponent
                        slides={forumResults.map((forum) =>
                        (
                            <ForumCard key={forum._id} forum={forum}> </ForumCard>
                        )
                        )}>
                    </ForumSwiperComponent>
                ) : (
                    <p>{searchAlert}</p>
                )}
            </div>
        
        </>
    );
}