import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography, Box, Button, CardActionArea } from '@mui/material';

import config from '../config';
import axios from "axios";

// colors
const gold = "#daaa00";
const light_yellow = "#F0DE89";

function ForumDetails() {

    const dummyForumId = '67155957745022ecfcc91a8b'; //object id of 251 in forum_test
    const [forums, setForums] = useState([dummyForumId]);
    const [forumObjs, setForumObjs] = useState([]);

    const [selectedForumId, setSelectedForumId] = useState(forums[0]);
    const [currentForum, setCurrentForum] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [currentPost, setCurrentPost] = useState(null);

    const selectForum = (forumId) => {
        setSelectedForumId(forumId);
        console.log("selectedid", selectedForumId);
        setCurrentForum(forumObjs.find(forum => forum._id === forumId));
        console.log("currentforum: ", currentForum);
        
    };
    const selectPost = (postId) => {
        setSelectedPostId(postId);
        setCurrentPost(currentForum.posts.find(post => post._id === postId));
        console.log("currentPost: ", currentPost);
    };

    const getForumInfo = async (forums) => {
        const forumData = [];
        for (let i = 0; i < forums.length; i++) {
            try{
                const res = await axios.get(`${config.API_BASE_URL}/forum/getForum?forumId=${forums[i]}`)
                const data = await res.data;
                forumData.push(data);
            }catch(error){
                console.log("error fetching forums: ", error);
            }
        }
        console.log("forumData: ", forumData);
        // return forumData;
        setForumObjs(forumData);
    };
    useEffect(() => {
        const fetchForumInfo = async () => {
            await getForumInfo(forums);  
        }
        fetchForumInfo();
        selectForum(selectedForumId);
    }, []);
    useEffect(() => {
        selectForum(selectedForumId);
    }, [forumObjs]);


    return (
        <div>
            <Grid container
                // spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{width: "100%",
                    borderRadius: 5, overflow: "hidden",
                    outline: `3px solid ${gold}`,
                }}
            >
                {/* list of user's forum + forum currently viewing */}
                <Grid item xs={12}
                    sx={{
                        // backgroundColor: "lightgray", 
                        height: "100vh", width: "15%"}}
                >
                    {forums === null ? (
                        <Typography>no forums...</Typography>
                    ) : (
                        forumObjs.map((forum, index) => (
                            <Card key={index} 
                                sx={{
                                    backgroundColor:  forum._id === selectedForumId ? light_yellow : 'transparent',
                                    }}>
                                <CardActionArea onClick={() => {selectForum(forum._id)}}>
                                    <CardContent>
                                        <Typography>{forum.course_code}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
                    )}
                </Grid>
                <Grid item xs={12}
                    sx={{
                        // backgroundColor: "gray", 
                        height: "100vh", width: "30%",
                        borderLeft: `2px solid ${gold}`
                    }}
                >
                    {/* Forum Posts */}
                    <Box sx={{backgroundColor: "lightgray", borderRadius: "10px", height: "3rem", margin: "5px" }}>Insert Search Bar</Box>
                    {(currentForum === null || currentForum === undefined || currentForum.posts === null || currentForum.posts === undefined) ? (
                        <Typography>no posts yet...</Typography>
                    ) : (
                        currentForum.posts.map((post, index) => (
                            <Card key={index} 
                                sx={{
                                    backgroundColor:  post._id === selectedPostId ? light_yellow : 'transparent',
                                    }}>
                                <CardActionArea onClick={() => {selectPost(post._id)}}>
                                    <CardContent>
                                        <Typography>{post.title}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
                    )}

                </Grid>
                <Grid item xs={12}
                    sx={{
                        height: "100vh", width: "55%",
                        borderLeft: `2px solid ${gold}`
                    }}
                >
                   {/* Post Details */}
                   {(currentPost === null || currentPost === undefined || currentPost.title === null || currentPost.title === undefined) ? (
                        <Box sx={{height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                            <Typography>select a post to read</Typography> 
                            <Typography>{"<================"}</Typography>
                        </Box>
                    ) : (
                        <Card>
                            <CardContent sx={{height: "100vh"}}>
                                <Typography>{currentPost.title}</Typography>
                                <Typography>{currentPost.body}</Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </div>
    );
}
export default ForumDetails;