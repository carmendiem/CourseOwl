import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, Typography, Box, Button, CardActionArea, TextField } from '@mui/material';
import { Radio, RadioGroup, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Add , Verified } from '@mui/icons-material';
import "./ForumDetails.css";
import { PostSearch } from './PostSearch';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StarIcon from '@mui/icons-material/Star';
import ForumIcon from '@mui/icons-material/Forum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReportIcon from '@mui/icons-material/Report';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import config from '../../config';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


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
    const [currentPostAuthorVer, setCurrentPostAuthorVer] = useState(null);
    const [joined, setJoined] = useState(false);

    const [searchedPosts, setSearchedPosts] = useState(null);
    const tags = ["general", "questions"];
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatedPost, setUpdatedPost] = useState(null);

    const [selectedIcon, setSelectedIcon] = useState(null);

    const [open, setOpen] = useState(false);

    const handleIconClick = async (type, forumId) => {
        if (selectedIcon === type) {
            setSelectedIcon(null);
            type = "none"
        }
        else {
            setSelectedIcon(type); // Update the selected icon
        }
    
        try {
            const res = await axios.get(`${config.API_BASE_URL}/forum/getSortedPosts?type=${type}&forumId=${forumId}&savedPosts=${user.savedPosts}&searchTerm=${searchTerm}`);
            const data = await res.data;
            setSearchedPosts(data);
        } catch (error) {
            console.log("error getting sorted posts: ", error);
        }
    };

    const getIconButtonColor = (type) => (selectedIcon === type ? 'primary' : 'default');

    const [drafting, setDrafting] = useState(false);
    const startDraft = () => {
        setDrafting(true);
        setCurrentPost(null);
        setSelectedPostId(null);
    }

    const handleDraftSubmitted = () => {
        setDrafting(!drafting);
        setSearchTerm("");
        setSelectedIcon(null);
        getIconButtonColor('default')
        setSelectedTag(null);
        setSearchedPosts(null);
    };

    const selectForum = (forumId) => {
        setSelectedForumId(forumId);
        setCurrentForum(forumObjs.find(forum => forum._id === forumId));
        if (user != null && user.savedForums.includes(forumId)) {
            setJoined(true);
        } else {
            setJoined(false);
        }
        setSelectedTag(null);
    };
    const selectPost = (postId) => {
        setSelectedPostId(postId);
        setCurrentPost(currentForum.posts.find(post => post._id === postId));
        setDrafting(false);
    };
    const handleCurrentPost = (post, author, ver) => {
        setCurrentPost(post);
        setCurrentPostAuthor([...currentPostAuthor, author]);
        setCurrentPostAuthorVer([...currentPostAuthorVer, ver]);
    };

    const getUser = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
            setUser(res.data.user);
        } catch (error) {
            console.log("error fetching user: ", error);
        }
    };

    const getForumInfo = async (forums) => {
        const forumData = [];
        for (let i = 0; i < forums.length; i++) {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/forum/getForum?forumId=${forums[i]}`)
                const data = await res.data;
                forumData.push(data);
            } catch (error) {
                console.log("error fetching forums: ", error);
            }
        }
        setForumObjs(forumData);
    };

    const getUserNameVerification = async (userId) => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/forum/getUserNameVerification?userId=${userId}`)
            const data = await res.data;
            return data;
        }catch(error){
            console.log("error fetching user: ", error);
        }
    };

    const searchByTag = async (searchTerm, forumId, tag) => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/forum/getPost?searchTerm=${searchTerm}&forumId=${forumId}&tag=${tag}`);
            const data = await res.data;
            return data;
        } catch (error) {
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

    const handleJoinLeaveClick = async (event) => {
        if (joined) { 
            setOpen(true); // dialog to confirm leave
        } else {
            await joinLeaveForum(event);
            setJoined(!joined);
        }
    }

    const handleConfirmLeave = async () => {
        setOpen(false);
        await joinLeaveForum();
        setJoined(!joined);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const joinLeaveForum = async (event) => {
        console.log("Join/Leave forum clicked");
        const userId = user.id;
        const forumId = selectedForumId;
        try {
            const res = await axios.get(`${config.API_BASE_URL}/forum/joinLeaveForum?userId=${userId}&forumId=${forumId}`);
            user.savedForums = res.data.savedForums;
            joined = !joined;
        } catch (error) {
            console.log("Error joining/leaving forum: ", error);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            await getUser();
        }
        fetchUser();
        selectForum(selectedForumId);
    }, []); 

    useEffect(() => {
        const fetchUserForums = async () => {
            await getForumInfo(forums);
        }
        if (user != null) { 
            if (user.savedForums.includes(forumId)) {
                setForums(user.savedForums);
            } else {
                setForums([forumId, ...user.savedForums]);
            }
            fetchUserForums();  
        }
    }, [user]);

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
        if (selectedPostId != null) { selectPost(selectedPostId) }
    }, [forumObjs]);

    useEffect(() => {
        setCurrentPostAuthor([]);
        setCurrentPostAuthorVer([]);
        const fetchUserInfo = async () => {
            const names = [];
            const verified = [];
            if(currentPost != null){
                const response = await getUserNameVerification(currentPost.author);
                verified.push(response.verStatus);
                if (currentPost.anon != null && currentPost.anon) {
                    names.push("Anon");
                }
                else {
                    names.push(response.name);
                }  
                if (currentPost.comments != null) {
                    for (let i = 0; i < currentPost.comments.length; i++) {
                        const comment = await getUserNameVerification(currentPost.comments[i].author);
                        verified.push(comment.verStatus)
                        if (currentPost.comments[i].anon != null && currentPost.comments[i].anon) {
                            names.push("Anon");
                        }
                        else {
                            const name = await getUserNameVerification(currentPost.comments[i].author);
                            names.push(name);
                        }
                    }
                }
            }
            setCurrentPostAuthor(names);
            setCurrentPostAuthorVer(verified);
        }
        fetchUserInfo();
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
                            <>
                            <Card key={index}
                                sx={{
                                    backgroundColor: forum._id === selectedForumId ? light_yellow : 'transparent',
                                    boxShadow: 'none', borderBottom: '1px solid gray', borderRadius: '0px'
                                }}>
                                <CardActionArea onClick={() => { selectForum(forum._id) }}>
                                    <CardContent>
                                        {(forum.course_code === null || forum.course_code === undefined) ?
                                            <Typography className='forum-list-title'> {forum.name}</Typography> :
                                            <Typography className='forum-list-title'>{forum.course_code}</Typography>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            {forum._id === selectedForumId ? (<DisplayTagSelector tags={tags} selectedTag={selectedTag} handleTagClick={handleTagClick}/>): null}
                            </>
                        ))
                    )}
                    {/* sort by category */}
                    {
                        // <div>
                        //     {tags.map((tag, index) => (
                        //         <div
                        //             key={index}
                        //             onClick={() => handleTagClick(tag)}
                        //             style={{
                        //                 display: 'flex',
                        //                 alignItems: 'center',
                        //                 cursor: 'pointer',
                        //                 padding: '10px',
                        //                 backgroundColor: selectedTag === tag ? '#f0f0f0' : 'white', // highlight when selected
                        //                 borderRadius: '4px',
                        //                 //margin: '5px 0',
                        //                 transition: 'background-color 0.3s',
                        //             }}
                        //         >
                        //             <div
                        //                 style={{
                        //                     width: '12px', // Width of the square
                        //                     height: '12px', // Height of the square
                        //                     // backgroundColor: getTagColor(currentForum, tag), // Tag color
                        //                     marginRight: '10px',
                        //                     borderRadius: '4px',
                        //                 }}
                        //             />
                        //             <Typography
                        //                 sx={{
                        //                     fontWeight: 'bold',
                        //                     margin: '0px',
                        //                     textAlign: 'left',
                        //                 }}
                        //             >
                        //                 {tag}
                        //             </Typography>
                        //         </div>
                        //     ))}
                        // </div>
                        // <DisplayTagSelector tags={tags} selectedTag={selectedTag} handleTagClick={handleTagClick()}/>
                    }
                </Grid>
                <Grid item xs={12} className="post-list-grid">
                    {/* Forum Posts */}
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ borderRadius: "10px", height: "3rem", margin: "5px", width: '70%' }}>
                            <PostSearch forumId={forumId} setSearchedPosts={changeSearchedPosts} tag={selectedTag} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </Box>
                        <IconButton variant="contained" className='new-post-button' onClick={() => startDraft()}>
                            <Typography>New Post</Typography>
                            <Add />
                        </IconButton>
                    </Box>
                    <Grid container justifyContent="space-between">
                        <Grid item xs={6} display="flex" justifyContent="flex-start">
                            <IconButton onClick={() => handleJoinLeaveClick()} sx={{ borderRadius: '8px' }}>
                                {joined ? 
                                (<><Typography variant='body1' sx={{ fontWeight: 'bold' }}>Leave Forum</Typography> <Bookmark /></>
                                ) : (<><Typography variant='body1' sx={{ fontWeight: 'bold' }}>Join Forum</Typography> <BookmarkBorder /></>)}
                            </IconButton>
                        </Grid>
                        <Grid item xs={6} display="flex" justifyContent="flex-end">
                            <IconButton onClick={() => handleIconClick('likes', selectedForumId)} color={getIconButtonColor('likes')}>
                                <ThumbUpIcon />
                            </IconButton>
                            <IconButton onClick={() => handleIconClick('saved', selectedForumId)} color={getIconButtonColor('saved')}>
                                <StarIcon />
                            </IconButton>
                            <IconButton onClick={() => handleIconClick('replies', selectedForumId)} color={getIconButtonColor('replies')}>
                                <ForumIcon />
                            </IconButton>
                            <IconButton onClick={() => handleIconClick('recent', selectedForumId)} color={getIconButtonColor('recent')}>
                                <AccessTimeIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Box sx={{ height: '2px', backgroundColor: "#daaa00" }} />
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
                                    <CardActionArea onClick={() => { selectPost(post._id) }}>
                                        <CardContent>
                                            <Typography className='post-list-title'>{post.title}</Typography>
                                            {(post.tag === null || post.tag === undefined) ? null : <Typography sx={{ color: getTagColor(currentForum, post.tag), fontWeight: "bold", margin: "0px", textAlign: "left" }} >{post.tag}</Typography>}
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
                                <CardActionArea onClick={() => { selectPost(post._id) }}>
                                    <CardContent>
                                        <Typography className='post-list-title'>{post.title}</Typography>
                                        {(post.tag === null || post.tag === undefined) ? null : <Typography sx={{ color: getTagColor(currentForum, post.tag), fontWeight: "bold", margin: "0px", textAlign: "left" }} >{post.tag}</Typography>}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )))}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Leave Forum</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to leave this forum?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleConfirmLeave}>Leave</Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
                
                <Grid item xs={12} className="post-display-grid">
                    {(drafting) ?
                        <DisplayDraft user={user} forum={currentForum} handleDraft={handleDraftSubmitted} /> :
                        ((currentPost === null || currentPost === undefined) ?
                            (<Box className='post-display'>
                                <Typography>Select a Post to Read</Typography>
                                <Typography>{"<================"}</Typography>
                            </Box>) :
                            <DisplayPostandReply user={user} forum={currentForum} post={currentPost} postAuthors={currentPostAuthor} postVer={currentPostAuthorVer} handlePost={handleCurrentPost} setUser={setUser} updatedPost={updatedPost} setUpdatedPost={setUpdatedPost} />
                        )}
                </Grid>
            </Grid>
        </div>
    );
}
export default ForumDetails;

function DisplayTagSelector({ tags, selectedTag, handleTagClick }) {
    return (
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
    )
}

function DisplayDraft({ user, forum, handleDraft }) {
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
        try {
            const res = await axios.post(`${config.API_BASE_URL}/forum/createPost`, null, { params: post });
            handleDraft();
        } catch (error) {
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
        const post = { title, body, anon, chosenTag, userId, forumId };
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
                <form onSubmit={handleSubmit} style={{ width: "95%", padding: '10px' }}>
                    <Grid item className="post-draft-entry">
                        {/* Title */}
                        <Typography variant='h6' sx={{ width: "10%", textAlign: "left", paddingTop: "5px" }}>Title:</Typography>
                        <TextField
                            sx={{ width: "90%" }}
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            helperText={titleError}
                        />
                    </Grid>
                    <Grid item className="post-draft-entry">
                        {/* Body */}
                        <Typography variant='h6' sx={{ width: "10%", textAlign: "left", paddingTop: "5px" }}>Body:</Typography>
                        <TextField
                            sx={{ width: "90%" }}
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
                        ) : (
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
                        <FormControlLabel sx={{ marginLeft: "auto" }}
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

function DisplayPostandReply({ user, forum, post, postAuthors, postVer, handlePost, setUser, updatedPost, setUpdatedPost }) {
    const [body, setBody] = useState("");
    const [anon, setAnon] = useState(false);
    const [bodyError, setBodyError] = useState("");
    const [upvotedPosts, setUpvotedPosts] = useState(user?.upvotedPosts || []);
    const [savedPosts, setSavedPosts] = useState(user?.savedPosts || []);
    const [open, setOpen] = React.useState(false);
    const [reportMessage, setReportMessage] = useState("")
    const [pendingReport, setPendingReport] = useState(false);

    useEffect(() => {
        if (pendingReport) {
            reportPost(forum._id, reportMessage);
            setPendingReport(false);
        }
    }, [reportMessage]);

    const handleReportOpen = (postId) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const reportPost = async (forumId) => {
        const reportData = {
            postName: post.title, 
            forumId: forumId,
            reportMessage: reportMessage,
            user: user
        };
        const res = await axios.post(`${config.API_BASE_URL}/forum/reportPost`, reportData);
    }

    const postComment = async (comment) => {
        try {
            const res = await axios.post(`${config.API_BASE_URL}/forum/createComment`, null, { params: comment });
            const commentInPost = { author: comment.userId, body: comment.body, anon: comment.anon };
            post.comments.push(commentInPost);
            if (comment.anon) {
                handlePost(post, "Anon", user.isVerified);
            } else {
                handlePost(post, user.name, user.isVerified);
            }
            setBody("");
            setAnon(false);
        } catch (error) {
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
        const comment = { body, anon, userId, forumId, postId };
        await postComment(comment);
    }

    const fetchPost = async (forumId, postId) => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/forum/getPostById?forumId=${forumId}&postId=${postId}`);
                const data = await res.data;
                setUpdatedPost(data);
            } catch (error) {
                console.log("error in fetching post: ", error);
            }
    }

    useEffect(() => {
        fetchPost(forum._id, post._id);
    }, [forum, post]) // removed savedPosts and upvotedPosts from use effect

    const handleUpvote = async (postId) => {
        try {
            const isUpvoted = upvotedPosts.includes(postId);
            const newUpvoteData = {
                userId: user.id || user._id,
                postId: postId,
                forumId: forum._id
            };
            if (!isUpvoted) {
                const res = await axios.post(`${config.API_BASE_URL}/forum/upvotePost`, newUpvoteData);
                const data = await res.data;
                setUser(data.user)
                setUpdatedPost(data.post);
                setUpvotedPosts([...upvotedPosts, postId]);
            } else {
                const res = await axios.post(`${config.API_BASE_URL}/forum/removeUpvote`, newUpvoteData);
                const data = await res.data;
                setUser(data.user)
                setUpdatedPost(data.post);
                setUpvotedPosts(upvotedPosts.filter(id => id !== postId));
            }

        } catch (error) {
            console.error('Error upvoting/downvoting post:', error);
        }
    };

    const handleBookmark = async (postId) => {
        try {
            const bookmarkData = {
                userId: user.id || user._id,
                postId: postId,
                forumId: forum._id
            };
            const res = await axios.post(`${config.API_BASE_URL}/forum/bookmarkPost`, bookmarkData);
            const data = await res.data;
            setSavedPosts(data.savedPosts)
            setUser(data)
        } catch (error) {
            console.error('Error saving post:', error);
        }
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
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                component: 'form',
                                onSubmit: (event) => {
                                    event.preventDefault();
                                    const formData = new FormData(event.currentTarget);
                                    const formJson = Object.fromEntries(formData.entries());
                                    const report = formJson.report;
                                    setReportMessage(report)
                                    setPendingReport(true)
                                    handleClose();
                                },
                            }}
                        >
                            <DialogTitle>Report Post</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Please briefly describe why you are reporting the post and our moderators will review shortly. Thank you!
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="name"
                                    name="report"
                                    label="Reason for reporting"
                                    type="report"
                                    fullWidth
                                    variant="standard"
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="submit">Report</Button>
                            </DialogActions>
                        </Dialog>
                    <Grid className='post-post-grid'>
                        <Typography className='post-card-title' variant='h3'>{post.title}</Typography>
                        <Box className='post-card-tag-author'>

                            <Typography className='post-card-author'>
                                Posted by <span style={{fontWeight: 'bold'}}>{postAuthors[0]} </span>
                                {postVer[0] ? <Verified sx={{ color: '#9baf4d', fontSize: '1rem', position: 'relative', top: '2px'}} />: null} 
                                {" "} as /
                            </Typography>
                            <Typography sx={{color: getTagColor(forum, post.tag), fontWeight: "bold", margin: "0px"}} >{post.tag}</Typography>
                        </Box>
                        <Box className='post-card-body-box'>
                                <Typography variant='body1' className='post-card-body-text'>{post.body}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" sx={{ justifyContent: 'space-between', width: '100%' }}>
                                <Box display="flex" alignItems="center">
                                    <IconButton
                                        color={upvotedPosts.includes(post._id) ? 'primary' : 'default'}
                                        onClick={() => handleUpvote(post._id)}
                                    >
                                        <ThumbUpIcon />
                                    </IconButton>
                                    <Typography sx={{ ml: 0.5 }}>{updatedPost?.upvotes ?? post.upvotes}</Typography>
                                    <IconButton
                                        color={savedPosts.includes(post._id) ? 'primary' : 'default'}
                                        onClick={() => handleBookmark(post._id)}
                                    >
                                        <StarIcon />
                                    </IconButton>
                                </Box>

                                {/* Report Icon on the right */}
                                <IconButton
                                    onClick={() => handleReportOpen(post._id)}
                                >
                                    <ReportIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Typography sx={{ textAlign: "left" }}>Comments:</Typography>
                    {post.comments === null || post.comments.length === 0 ? (
                        null
                    ) : (
                        <Grid className='post-comment-grid'>
                            {post.comments.map((comment, index) => (
                                <Box key={index} sx={{padding: "5px"}}>
                                        <Typography className='post-comment-author'>
                                            {postAuthors[index+1]} 
                                            {postVer[index+1] ? (
                                                <Verified sx={{ color: '#9baf4d', fontSize: '1rem', marginLeft: '3px', position: 'relative', top: '2px'}} />
                                            ) : null} 
                                        </Typography>
                                    <Typography variant='body1' className='post-comment-body'>{comment.body}</Typography>
                                </Box>
                            ))}
                        </Grid>
                    )}
                    <Grid className='reply-box-grid'>
                        <form onSubmit={handleReply} style={{ width: "100%" }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Reply"
                                multiline
                                rows={2}
                                variant="outlined"
                                sx={{ width: "100%" }}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                helperText={bodyError}
                            />
                            <Grid className="anon-submit-grid">
                                {/* Anon */}
                                <FormControlLabel sx={{ marginLeft: "auto" }}
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
                    <Box sx={{ height: '25px' }} />
                </CardContent>
            </Card>
        )
    );
}