import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography, Box, Button, CardActionArea, Dialog, TextField } from '@mui/material';
import { Radio, RadioGroup, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';

import config from '../config';
import axios from "axios";

// colors
const gold = "#daaa00";
const light_yellow = "#F0DE89";

function ForumDetails() {

    const { forumId } = useParams(); //forum id from url

    const [forums, setForums] = useState([forumId]);
    const [forumObjs, setForumObjs] = useState([]);

    const [selectedForumId, setSelectedForumId] = useState(forums[0]);
    const [currentForum, setCurrentForum] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [currentPost, setCurrentPost] = useState(null);
    const [currentPostAuthor, setCurrentPostAuthor] = useState(null);

    const selectForum = (forumId) => {
        setSelectedForumId(forumId);
        console.log("selectedid", selectedForumId);
        setCurrentForum(forumObjs.find(forum => forum._id === forumId));
        console.log("currentforum: ", currentForum);
        
    };
    const selectPost = (postId) => {
        setSelectedPostId(postId);
        setCurrentPost(currentForum.posts.find(post => post._id === postId));
        setCurrentPostAuthor([]);
        console.log("currentPost: ", currentPost);
        setDrafting(false);
    };

    const getForumInfo = async (forums) => {
        const forumData = [];
        for (let i = 0; i < forums.length; i++) {
            try{
                console.log("HERE: " + forums[i])
                const res = await axios.get(`${config.API_BASE_URL}/forum/getForum?forumId=${forums[i]}`)
                const data = await res.data;
                forumData.push(data);
            }catch(error){
                console.log("error fetching forums: ", error);
            }
        }
        console.log("forumData: ", forumData);
        setForumObjs(forumData);
    };

    const getUserName = async (userEmail) => {
        try{
            const res = await axios.get(`${config.API_BASE_URL}/forum/getUserName?email=${userEmail}`)
            const data = await res.data;
            return data;
        }catch(error){
            console.log("error fetching forums: ", error);
        }
    };


    useEffect(() => {
        console.log("ID??? " + forumId)
        const fetchForumInfo = async () => {
            await getForumInfo(forums);  
        }
        fetchForumInfo();
        selectForum(selectedForumId);
    }, [forumId]);
    useEffect(() => {
        selectForum(selectedForumId);
    }, [forumObjs]);

    useEffect(() => {
        const fetchUserNames = async () => {
            const names = [];
            if(currentPost != null){
                if (currentPost.anon != null && currentPost.anon) {
                    names.push("Anon");
                }  
                else {
                    const name = await getUserName(currentPost.author);
                    names.push(name);
                    console.log("name: ", name);
                    console.log("names: ", names);
                }  
                if (currentPost.comments != null) {
                    for (let i = 0; i < currentPost.comments.length; i++) {
                        const name = await getUserName(currentPost.comments[i].author);
                        names.push(name);
                        if (currentPost.comments[i].anon != null && currentPost.comments[i].anon) {
                            names.push("Anon");
                        }  
                        else {
                            const name = await getUserName(currentPost.comments[i].author);
                            names.push(name);         
                        }  
                    }
                }
            }
            setCurrentPostAuthor(names);
        }
        fetchUserNames();
        console.log("currentPostAuthor: ", currentPostAuthor);
    }, [currentPost]);

    const [drafting, setDrafting] = useState(false);
    const startDraft = () => {
        setDrafting(true);
        setCurrentPost(null);
        setSelectedPostId(null);
    }

    return (
        <div>
            <Grid container
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
                        height: "100vh", width: "10%"}}
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
                        height: "100vh", width: "35%",
                        borderLeft: `2px solid ${gold}`,
                        overflow: "hidden",
                        overflowY: "auto"
                    }}
                >
                    {/* Forum Posts */}
                    <Box sx={{display: 'flex',flexDirection: 'row'}}>
                        <Box sx={{backgroundColor: "lightgray", borderRadius: "10px", height: "3rem", margin: "5px", width: '70%' }}>Insert Search Bar</Box>
                        <Button variant="contained" sx={{borderRadius: "10px", margin: "5px", height: "3rem", width : '27%'}} onClick={() => startDraft()}>New Post</Button>
                    </Box>
                    {(currentForum === null || currentForum === undefined || currentForum.posts === null || currentForum.posts === undefined) ? (
                        <Typography>no posts yet...</Typography>
                    ) : (
                        currentForum.posts.map((post, index) => (
                            <Card key={index} 
                                sx={{
                                    backgroundColor: post._id === selectedPostId ? light_yellow : 'transparent',
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
                    {(drafting) ? <DisplayDraft forum={currentForum}/> : <DisplayPost post={currentPost} postAuthors={currentPostAuthor}/>}
                </Grid>
            </Grid>
        </div>
    );
}
export default ForumDetails;

function DisplayDraft({forum}) {
    const [user, setUser] = useState(null);
    const forumId = forum._id;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [chosenTag, setChosenTag] = useState("");
    const [titleError, setTitleError] = useState("");
    const [bodyError, setBodyError] = useState("");

    useEffect(() => {
        getUser();
        if (forum.tags === null || forum.tags === undefined) {
            return;
        } else {
            setChosenTag(forum.tags[0]);
        }
    }, []);

    const getUser = async () => {
        try{
            const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
            setUser(res.data.user);
            console.log("user: ", res.data.user);
        }catch(error){
            console.log("error fetching user: ", error);
        }
    }

    const postPost = async (post) => {
        try{
            const res = await axios.post(`${config.API_BASE_URL}/forum/createPost`, null, {params: post});
            console.log("post created successfully: ", res.data);
        }catch(error){
            console.log("error posting post: ", error);
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error("User is not loaded yet");
            await getUser();
        }
        if (!title) {
            setTitleError("Title cannot be empty");
            return;
        }
        if (!body) {
            setBodyError("Body cannot be empty");
            return;
        }
        const userEmail = user.email;
        console.log("user", user);
        console.log("userEmail: ", userEmail);
        const post = { title, body, anon, chosenTag, userEmail, forumId};
        await postPost(post);
    };

    if (!forum) {
        return (
            <div>
                <Typography>select a forum to post in</Typography>
            </div>
        );
    }
    return (
        <div>
            <Grid container 
                sx={{
                    backgroundColor: "white", 
                    width: "100%",height: "100vh", 
                    display: "flex", flexDirection: "column", 
                    paddingTop: "20px",
                }}>
                <form onSubmit={handleSubmit} style={{ width: "95%", padding: '10px'}}>  
                    <Grid item sx={{display: "flex", flexDirection: "row", marginBottom: '10px'}}> 
                        {/* Title */}
                        <Typography variant='h6' sx={{width: "10%"}}>Title</Typography>
                        <TextField
                            sx={{width: "90%"}}
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            helperText={titleError}
                        />
                    </Grid>
                    <Grid item sx={{display: "flex", flexDirection: "row", marginBottom: '10px'}}>
                        {/* Body */}
                        <Typography variant='h6' sx={{width: "10%"}}>Body</Typography>
                        <TextField
                            sx={{width: "90%"}}
                            variant="outlined"
                            multiline
                            rows={4}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            helperText={bodyError}
                        />
                    </Grid>
                    <Grid>
                        {/* Tags */}
                        {(forum.tags === null || forum.tags === undefined) ? (
                            null
                        ):(
                            <RadioGroup
                                value={chosenTag}
                                onChange={(e) => setChosenTag(e.target.value)}
                                row
                            >
                                {forum.tags.map((tag, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={tag}
                                        control={<Radio color="primary" />}
                                        label={tag}
                                    />
                                ))}
                            </RadioGroup>
                        )}
                    </Grid>
                    <Grid item sx={{display: "flex", flexDirection: "row", marginBottom: '10px'}}>
                        {/* Anon */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={anon}
                                    onChange={(e) => setAnon(e.target.checked)}
                                    name="anon"
                                    color="primary"
                                />
                            }
                            label="Post Anonmyously"
                        />
                    </Grid>
                    <Grid item sx={{alignItems: 'left'}}>
                        <button type="submit" style={{ padding: "10px 20px" }}>Submit</button>
                    </Grid>
                </form>
            </Grid>
        </div>
    ); 
}

function DisplayPost ({post, postAuthors}) {
    return (
        (post === null || post === undefined || postAuthors.length === 0) ? (
            <Box sx={{backgroundColor: "white", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Typography>select a post to read</Typography> 
                <Typography>{"<================"}</Typography>
            </Box>
        ) : (
            <Card sx={{height: "100%", overflow: "hidden"}}>
                <CardContent sx={{height: "100%", overflowY: "auto"}}>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', }}>
                        <Typography variant='h3'>{post.title}</Typography>
                        <Typography variant='h6' sx={{marginLeft: '20px'}}>by {postAuthors[0]}</Typography>
                    </Box>
                    <Box sx={{padding: '10px'}}>
                        <Typography variant='body1' sx={{ textAlign: 'left'}}>{post.body}</Typography>
                    </Box>
                    <Typography variant='h6'sx={{textAlign: 'left'}}>Comments:</Typography>
                    {post.comments === null || post.comments.length === 0 ? (
                        <Typography>no comments yet...</Typography>
                    ):(
                        post.comments.map((comment, index) => (
                            <Box key={index} sx={{padding: "5px"}}>
                                <Typography sx={{textAlign: 'left'}}>by {postAuthors[index+1]}:</Typography>
                                <Typography variant='body1' sx={{marginLeft:'10px', textAlign: 'left'}}>{comment.body}</Typography>
                            </Box>
                        ))
                    )}
                    <Box sx={{height: '25px'}}/>
                </CardContent>
            </Card>
        )
    );
}