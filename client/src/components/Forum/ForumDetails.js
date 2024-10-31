import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography, Box, Button, CardActionArea, TextField } from '@mui/material';
import { Radio, RadioGroup, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Add} from '@mui/icons-material';
import "./ForumDetails.css";
import { PostSearch } from './PostSearch';

import config from '../../config';
import axios from "axios"; 

// colors
const light_yellow = "#fbefb5";

const getTagColor = (forum, tag) => {
    if (forum.tags === null || forum.tags === undefined) {
        return "gray";
    } else { 
        var tagNum = -1;
        for (let i = 0; i < forum.tags.length; i++) {
            if (tag === forum.tags[i]) {
                tagNum = i;
                break;
            }
        }
        switch (tagNum % 5) {
            case 0:
                return "#e3697a";
            case 1:
                return "#ce8147";
            case 2:
                return "#cab008";   
            case 3:
                return "#9baf4d";
            case 4:
                return "#60a867";  
            default:
                return "gray";
        }
    }    
}

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
    const tags = ["general", "questions"];
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [drafting, setDrafting] = useState(false);
    const startDraft = () => {
        setDrafting(true);
        setCurrentPost(null);
        setSelectedPostId(null);
    }

    const handleDraftSubmitted = () => {
        setDrafting(!drafting);
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
    const handleCurrentPost = (post, author) => {
        setCurrentPost(post);
        setCurrentPostAuthor([...currentPostAuthor, author]);
    }
    
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
        }catch(error){
            console.log("error fetching user: ", error);
        }
    };

    const getUserName = async (userId) => {
        try{
            const res = await axios.get(`${config.API_BASE_URL}/forum/getUserName?userId=${userId}`)
            const data = await res.data;
            return data;
        }catch(error){
            console.log("error fetching forums: ", error);
        }
    };

    const searchByTag = async (searchTerm, forumId, tag) => {
        try{
            const res = await axios.get(`${config.API_BASE_URL}/forum/getPost?searchTerm=${searchTerm}&forumId=${forumId}&tag=${tag}`);
            const data = await res.data;
            return data;
        }catch(error){
            console.log("error fetching posts: ", error);
        }
    }

    const handleTagClick = async (tag) => {
        if (selectedTag === tag) {
            setSelectedTag(null); // deselect if the same tag is clicked
            const result = await searchByTag(searchTerm, forumId, null);
            setSearchedPosts(result);
            
        } else {
            setSelectedTag(tag); // set new selected tag
            const result = await searchByTag(searchTerm, forumId, tag);
            setSearchedPosts(result);
        }
    };

    useEffect(() => {
        getUser();
        const fetchForumInfo = async () => {
            await getForumInfo(forums);  
        }
        fetchForumInfo();
        selectForum(selectedForumId);
    }, []);

    const changeSearchedPosts = (searchedPosts) => {
        setSearchedPosts(searchedPosts);
    }

    useEffect(() => {
        const fetchForumInfo = async () => {
            await getForumInfo(forums);  
        }
        fetchForumInfo();
        selectForum(selectedForumId);
    }, [forumId, drafting]);
    useEffect(() => {
        selectForum(selectedForumId);
        if (selectedPostId!=null) {selectPost(selectedPostId)}
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
    }, [currentPost]);

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
                                sx={{ backgroundColor:  forum._id === selectedForumId ? light_yellow : 'transparent', 
                                    boxShadow: 'none', borderBottom: '1px solid gray', borderRadius: '0px'
                                }}>
                                <CardActionArea onClick={() => {selectForum(forum._id)}}>
                                    <CardContent>
                                        {(forum.course_code === null || forum.course_code === undefined) ? 
                                            <Typography className='forum-list-title'> {forum.name}</Typography> : 
                                            <Typography className='forum-list-title'>{forum.course_code}</Typography>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))
                    )}
                    {/* sort by category */}
                    {
                       <div>
                       {tags.map((tag, index) => (
                           <div
                               key={index}
                               onClick={() => handleTagClick(tag)}
                               style={{
                                   display: 'flex',
                                   alignItems: 'center',
                                   cursor: 'pointer',
                                   padding: '10px',
                                   backgroundColor: selectedTag === tag ? '#f0f0f0' : 'white', // highlight when selected
                                   borderRadius: '4px',
                                   //margin: '5px 0',
                                   transition: 'background-color 0.3s',
                               }}
                           >
                               <div
                                   style={{
                                       width: '12px', // Width of the square
                                       height: '12px', // Height of the square
                                      // backgroundColor: getTagColor(currentForum, tag), // Tag color
                                       marginRight: '10px',
                                       borderRadius: '4px',
                                   }}
                               />
                               <Typography
                                   sx={{
                                       fontWeight: 'bold',
                                       margin: '0px',
                                       textAlign: 'left',
                                   }}
                               >
                                   {tag}
                               </Typography>
                           </div>
                       ))}
                   </div>
                    }
                </Grid>
                <Grid item xs={12} className="post-list-grid">
                    {/* Forum Posts */}
                    <Box sx={{display: 'flex',flexDirection: 'row'}}>
                        <Box sx={{borderRadius: "10px", height: "3rem", margin: "5px", width: '70%' }}>
                            <PostSearch forumId={forumId} setSearchedPosts={changeSearchedPosts} tag={selectedTag} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                        </Box>
                        <IconButton variant="contained" className='new-post-button' onClick={() => startDraft()}>
                            <Typography>New Post</Typography>
                            <Add/>
                        </IconButton>
                    </Box>
                    <Box sx={{height: '2px', backgroundColor: "#daaa00"}}/>
                    {(currentForum === null || currentForum === undefined || currentForum.posts === null || currentForum.posts.length === 0) ? (
                        <Typography>no posts yet...</Typography>
                    ) : (searchedPosts) ? (
                        (searchedPosts.length > 0) ? (
                        searchedPosts.map((post, index) => (
                            <Card key={index} 
                                sx={{
                                    backgroundColor: post._id === selectedPostId ? light_yellow : 'white',
                                    boxShadow: 'none', borderBottom: '1px solid gray', borderRadius: '0px'
                                    }}>
                                <CardActionArea onClick={() => {selectPost(post._id)}}>
                                    <CardContent>
                                        <Typography className='post-list-title'>{post.title}</Typography>
                                        {(post.tag === null || post.tag === undefined) ? null : <Typography sx={{color: getTagColor(currentForum, post.tag), fontWeight: "bold", margin: "0px", textAlign: "left"}} >{post.tag}</Typography>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))) : (
                            <Typography>No posts found, please search again!</Typography>
                        )
                    ) : (
                        currentForum.posts.map((post, index) => (
                            <Card key={index} 
                                sx={{
                                    backgroundColor: post._id === selectedPostId ? light_yellow : 'white',
                                    boxShadow: 'none', borderBottom: '1px solid gray', borderRadius: '0px'
                                }}>
                                <CardActionArea onClick={() => {selectPost(post._id)}}>
                                    <CardContent>
                                        <Typography className='post-list-title'>{post.title}</Typography>
                                        {(post.tag === null || post.tag === undefined) ? null : <Typography sx={{color: getTagColor(currentForum, post.tag), fontWeight: "bold", margin: "0px", textAlign: "left"}} >{post.tag}</Typography>}
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
                            <DisplayPostandReply user={user} forum={currentForum} post={currentPost} postAuthors={currentPostAuthor} handlePost={handleCurrentPost}/> 
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
        const userId = user.id;
        const post = { title, body, anon, chosenTag, userId, forumId};
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
                        <Typography variant='h6' sx={{width: "10%", textAlign: "left", paddingTop: "5px"}}>Title:</Typography>
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
                        <Typography variant='h6' sx={{width: "10%", textAlign: "left", paddingTop: "5px"}}>Body:</Typography>
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
                    <Grid item className='anon-submit-grid'>
                        {/* Anon */}
                        <FormControlLabel sx={{marginLeft: "auto"}}
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
                        <Button type="submit" className='post-button'>Post</Button>
                    </Grid>
                </form>
            </Grid>
        </div>
    ); 
}

function DisplayPostandReply({user, forum, post, postAuthors, handlePost}) {
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [bodyError, setBodyError] = useState("");

    const postComment = async (comment) => {
        try{
            const res = await axios.post(`${config.API_BASE_URL}/forum/createComment`, null, {params: comment});
            const commentInPost = {author: comment.userId, body: comment.body, anon: comment.anon};
            post.comments.push(commentInPost);
            if (comment.anon) {
                handlePost(post,"Anon");
            } else {
                handlePost(post, user.name);
            }
            console.log("comment created successfully: ", res.data);
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
        const userId = user.id;
        const postId = post._id;
        const forumId = forum._id;
        const comment = {body, anon, userId, forumId, postId};
        await postComment(comment);
    }
    return (
        (post === null || post === undefined || postAuthors.length === 0) ? (
            <Box className="post-display">
                <Typography>Select a Post to Read</Typography> 
                <Typography>{"<================"}</Typography>
            </Box>
        ) : (
            <Card className='post-card'>
                <CardContent className='post-card-content'>
                    <Grid className='post-post-grid'>
                        <Typography className='post-card-title' variant='h3'>{post.title}</Typography>
                        <Box className='post-card-tag-author'>
                            <Typography className='post-card-author'>Posted by {postAuthors[0]} as /</Typography>
                            <Typography sx={{color: getTagColor(forum, post.tag), fontWeight: "bold", margin: "0px"}} >{post.tag}</Typography>
                        </Box>
                        <Box className='post-card-body-box'>
                            <Typography variant='body1' className='post-card-body-text'>{post.body}</Typography>
                        </Box>
                    </Grid>
                    <Typography sx={{textAlign: "left"}}>Comments:</Typography>
                    {post.comments === null || post.comments.length === 0 ? (
                        null
                    ):(
                        <Grid className='post-comment-grid'>
                            {post.comments.map((comment, index) => (
                                <Box key={index} sx={{padding: "5px"}}>
                                    <Typography className='post-comment-author'>{postAuthors[index+1]}:</Typography>
                                    <Typography variant='body1' className='post-comment-body'>{comment.body}</Typography>
                                </Box>   
                            ))}
                        </Grid>    
                    )}
                    <Grid className='reply-box-grid'>
                        <form onSubmit={handleReply} style={{width: "100%"}}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Reply"
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={{width: "100%"}}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                helperText={bodyError}
                            />
                            <Grid className="anon-submit-grid">
                                {/* Anon */}
                                <FormControlLabel sx={{marginLeft: "auto"}} 
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
                                <Button type="submit" className='post-button'>Post</Button>
                            </Grid>
                        </form>
                    </Grid>
                    <Box sx={{height: '25px'}}/>
                </CardContent>
            </Card>
        )
    );
}