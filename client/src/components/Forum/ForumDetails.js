import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography, Box, Button, CardActionArea, TextField } from '@mui/material';
import { Radio, RadioGroup, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Add} from '@mui/icons-material';
import "./ForumDetails.css";
import { PostSearch } from './PostSearch';

import config from '../../config';
import axios from "axios";

// colors
const gold = "#daaa00";
const light_yellow = "#F0DE89";

const Tag = styled(Grid)(({ theme }) => ({
    display: 'inline-block',
    backgroundColor: 'white',
    ...theme.typography.body2,
    textAlign: 'center',
    height: "50%", //set height 50% of parent
    // boxShadow: 'none',
    borderRadius: "10px",
    border: `1px solid ${gold}`,
    padding: '5px 10px',
}));

const flexRowStyle = {display: 'flex',flexDirection: 'row'};

function ForumDetails() {

    const { forumId } = useParams(); //forum id from url
    const [user, setUser] = useState(null);
    const [forums, setForums] = useState([forumId]);
    const [forumObjs, setForumObjs] = useState([]);

    const [selectedForumId, setSelectedForumId] = useState(forums[0]);
    const [currentForum, setCurrentForum] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [currentPost, setCurrentPost] = useState(null);
    const [currentPostAuthor, setCurrentPostAuthor] = useState(null);

    const [searchedPosts, setSearchedPosts] = useState(null);

    const [drafting, setDrafting] = useState(false);
    const startDraft = () => {
        setDrafting(true);
        setCurrentPost(null);
        setSelectedPostId(null);
    }

    const handleDraftSubmitted = () => {
        setDrafting(!drafting);
    };

    const [triggerPostRefresh, setTriggerPostRefresh] = useState(false);
    const [commenting, setCommenting] = useState(false);
    const handleCommentCommented = () => {
        setCommenting(!commenting);
        setTriggerPostRefresh(!triggerPostRefresh);
        console.log("commenting: ", commenting);
    };

    const selectForum = (forumId) => {
        setSelectedForumId(forumId);
        setCurrentForum(forumObjs.find(forum => forum._id === forumId));
        
    };
    const selectPost = (postId) => {
        setSelectedPostId(postId);
        setCurrentPost(currentForum.posts.find(post => post._id === postId));
        setCurrentPostAuthor([]);
        setDrafting(false);
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
        setForumObjs(forumData);
    };

    const getUser = async () => {
        try{
            const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
            setUser(res.data.user);
            // console.log("user: ", res.data.user);
        }catch(error){
            console.log("error fetching user: ", error);
        }
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
        getUser();
    }, []);

    const changeSearchedPosts = (searchedPosts) => {
        setSearchedPosts(searchedPosts);
    }

    useEffect(() => {
        console.log(forumObjs)
        const fetchForumInfo = async () => {
            await getForumInfo(forums);  
        }
        fetchForumInfo();
        selectForum(selectedForumId);
        console.log(forumObjs);
        console.log("currentforum:",currentForum)
    }, [forumId, drafting, commenting]);
    useEffect(() => {
        selectForum(selectedForumId);
        if (selectedPostId!=null) {selectPost(selectedPostId)}
        console.log("post reselected?");
        console.log(currentPost);
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
                }  
                if (currentPost.comments != null) {
                    for (let i = 0; i < currentPost.comments.length; i++) {
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
    }, [currentPost, triggerPostRefresh]);

    return (
        <div>
            <Grid container className="main-forum-container">
                {/* list of user's forum + forum currently viewing */}
                <Grid item xs={12} className="forum-list-grid">
                    {forums === null ? (
                        <Typography>no forums...</Typography>
                    ) : (
                        forumObjs.map((forum, index) => (
                            <Card key={index} 
                                sx={{ backgroundColor:  forum._id === selectedForumId ? light_yellow : 'transparent'}}>
                                <CardActionArea onClick={() => {selectForum(forum._id)}}>
                                    <CardContent>
                                        {(forum.course_code === null || forum.course_code === undefined) ? 
                                            <Typography> {forum.name}</Typography> : 
                                            <Typography>{forum.course_code}</Typography>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
                    )}
                </Grid>
                <Grid item xs={12} className="post-list-grid">
                    {/* Forum Posts */}
                    <Box sx={{display: 'flex',flexDirection: 'row'}}>
                        <Box sx={{borderRadius: "10px", height: "3rem", margin: "5px", width: '70%' }}>
                            <PostSearch forumId={forumId} setSearchedPosts={changeSearchedPosts}/>
                        </Box>
                        <IconButton variant="contained" className='new-post-button' onClick={() => startDraft()}>
                            <Typography>New Post</Typography>
                            <Add/>
                        </IconButton>
                    </Box>
                    {(currentForum === null || currentForum === undefined || currentForum.posts === null || currentForum.posts.length === 0) ? (
                        <Typography>no posts yet...</Typography>
                    ) : (searchedPosts && searchedPosts.length > 0) ? (
                        searchedPosts.map((post, index) => (
                            <Card key={index} 
                                sx={{
                                    backgroundColor: post._id === selectedPostId ? light_yellow : 'transparent'
                                    }}>
                                <CardActionArea onClick={() => {selectPost(post._id)}}>
                                    <CardContent>
                                        <Typography className='post-list-title' >
                                            {post.title}</Typography>
                                        {(post.tag === null || post.tag === undefined) ? null : <Tag>{post.tag}</Tag>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
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
                        )))}

                </Grid>
                <Grid item xs={12} className="post-display-grid">
                    {(drafting) ? 
                        <DisplayDraft user={user} forum={currentForum} handleDraft={handleDraftSubmitted}/> : 
                        ( (currentPost === null || currentPost === undefined) ? 
                            (<Box className='post-display'>
                                <Typography>Select a Post to Read</Typography> 
                                <Typography>{"<================"}</Typography>
                            </Box>) : 
                            <DisplayPost user={user} forumId={currentForum._id} post={currentPost} postAuthors={currentPostAuthor} handleComment={handleCommentCommented}/> 
                        )}
               </Grid>
            </Grid>
        </div>
    );
}
export default ForumDetails;

function DisplayDraft({user, forum, handleDraft}) {
    const forumId = forum._id;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [chosenTag, setChosenTag] = useState("");
    const [titleError, setTitleError] = useState("");
    const [bodyError, setBodyError] = useState("");

    useEffect(() => {
        if (forum.tags === null || forum.tags === undefined) {
            return;
        } else {
            setChosenTag(forum.tags[0]);
        }
    }, []);

    const postPost = async (post) => {
        try{
            const res = await axios.post(`${config.API_BASE_URL}/forum/createPost`, null, {params: post});
            handleDraft();
        }catch(error){
            console.log("error posting post: ", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error("User is not loaded yet");
            return;
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
        const post = { title, body, anon, chosenTag, userEmail, forumId};
        await postPost(post);

    };

    if (!forum) {
        return (
            <div>
                <Typography>Select a Forum to Post In.</Typography>
            </div>
        );
    }
    return (
        <div>
            <Grid container className="post-draft-grid">
                <form onSubmit={handleSubmit} style={{ width: "95%", padding: '10px'}}>  
                    <Grid item className="post-draft-entry"> 
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
                    <Grid item className="post-draft-entry">
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
                    <Grid item className='post-draft-entry'>
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
                    <Grid item sx={{alignItems: 'right'}}>
                        <Button type="submit" className='post-button'>Post</Button>
                    </Grid>
                </form>
            </Grid>
        </div>
    ); 
}

function DisplayPost ({user, forumId, post, postAuthors, handleComment}) {
    return (
        (post === null || post === undefined || postAuthors.length === 0) ? (
            <Box className="post-display">
                <Typography>Select a Post to Read</Typography> 
                <Typography>{"<================"}</Typography>
            </Box>
        ) : (
            <Card className='post-card'>
                <CardContent className='post-card-content'>
                    <Typography className='post-card-title' variant='h3'>{post.title}</Typography>
                    <Box className='post-card-tag-author'>
                        <Tag>{post.tag}</Tag>
                        <Typography variant='h6' className='post-card-author'>by {postAuthors[0]}</Typography>
                    </Box>
                    <Box className='post-card-body-box'>
                        <Typography variant='body1' className='post-card-body-text'>{post.body}</Typography>
                    </Box>
                    <Typography variant='h6'sx={{textAlign: 'left'}}>Comments:</Typography>
                    {post.comments === null || post.comments.length === 0 ? (
                        null
                    ):(
                        post.comments.map((comment, index) => (
                            <Box key={index} sx={{padding: "5px"}}>
                                <Typography className='post-comment-author'>by {postAuthors[index+1]}:</Typography>
                                <Typography variant='body1' className='post-comment-body'>{comment.body}</Typography>
                            </Box>
                        ))
                    )}
                    <ReplyBox user={user} forumId={forumId} postId={post._id} handleComment={handleComment}/>
                    <Box sx={{height: '25px'}}/>
                </CardContent>
            </Card>
        )
    );
}

function ReplyBox({user, forumId, postId, handleComment}) {
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [bodyError, setBodyError] = useState("");

    const postComment = async (comment) => {
        try{
            const res = await axios.post(`${config.API_BASE_URL}/forum/createComment`, null, {params: comment});
            console.log("comment created successfully: ", res.data);
            handleComment();
            setBody("");
            setAnon(false);
        }catch(error){
            console.log("error posting post: ", error);
        }
    }

    const handleReply = async (e) => {
        e.preventDefault();
        if (!user) {
            console.error("User is not loaded yet");
            return;
        }
        if (!body) {
            setBodyError("Comment cannot be empty");
            return;
        }
        const userEmail = user.email;
        const comment = {body, anon, userEmail, forumId, postId};
        await postComment(comment);
    }

    return (
        <Grid
            sx={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px",
                margin: "10px",
            }}
        >
            <form onSubmit={handleReply} style={{width: "100%"}}>
                <TextField
                    id="outlined-multiline-static"
                    label="Reply"
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{width: "100%"}}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    helperText={bodyError}
                />
                <Grid item x={{flexRowStyle, marginBottom: '10px'}}>
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
                <button type="submit" style={{ padding: "10px 20px" }}>Post</button>
            </form>
        </Grid>
    );
}