// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import config from '../config';
// import Grid from '@mui/material/Grid';
// import { Typography, Card, CardContent, Button, Chip, Rating, Box, TextField, IconButton } from '@mui/material';
// import { Pie } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'; 
// import StarIcon from '@mui/icons-material/Star';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import DeleteIcon from '@mui/icons-material/Delete'; 
// import VerifiedIcon from '@mui/icons-material/Verified';

// Chart.register(ArcElement, Tooltip, Legend);

// function ProfessorDetails() {
//   const { alias } = useParams();
//   const [professor, setProfessor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState('');
//   const [user, setUser] = useState(null); 
//   const [upvotedReviews, setUpvotedReviews] = useState(null); 
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     const fetchProfessorAndUser = async () => {
//       try {
//         const professorRes = await axios.get(`${config.API_BASE_URL}/professor/${alias}`);
//         setProfessor(professorRes.data);

//         const reviewsRes = await axios.get(`${config.API_BASE_URL}/professor/${alias}/reviews`);
//         setReviews(reviewsRes.data);

//         const userRes = await axios.get(`${config.API_BASE_URL}/user/full`, { withCredentials: true });
//         if (userRes.data.user) {
//           setUser(userRes.data.user);
//           setUpvotedReviews(userRes.data.user.upvotedReviews); 

//         } else {
//           navigate('/login'); 
//         }

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Error fetching professor');
//         setLoading(false);
        
//       }
//     };
//     fetchProfessorAndUser();
//   }, [alias, navigate]);

//   const handleUpvote = async (reviewId) => {
//     try {
//       const isUpvoted = upvotedReviews.includes(reviewId);
//       const newUpvoteData = {
//         user: user
//       };
//       if (!isUpvoted) {
//         await axios.post(`${config.API_BASE_URL}/professor/reviews/${reviewId}/upvote`, newUpvoteData);
//       } else {
//         await axios.post(`${config.API_BASE_URL}/professor/reviews/${reviewId}/remove-upvote`, newUpvoteData);
//       }

//       setReviews((prevReviews) => 
//         prevReviews.map((review) =>
//           review._id === reviewId
//             ? { ...review, upvotes: isUpvoted ? review.upvotes - 1 : review.upvotes + 1 }
//             : review
//         )
//       );

//       if (isUpvoted) {
//         setUpvotedReviews(upvotedReviews.filter(id => id !== reviewId)); 
//       } else {
//         setUpvotedReviews([...upvotedReviews, reviewId]); 
//       }
//     } catch (error) {
//       console.error('Error upvoting review:', error);
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     try {
//       await axios.delete(`${config.API_BASE_URL}/professor/reviews/${reviewId}`);
//       setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
//       setUpvotedReviews(upvotedReviews.filter(id => id !== reviewId));

//     } catch (error) {
//       console.error('Error deleting review:', error);
//     }
//   };

//   const handleSubmitReview = async () => {
//     if (!newReview.trim()) return;
//     if (!user) {
//       navigate('/login'); 
//       return;
//     }
//     try {
//       const newReviewData = {
//         userEmail: user.email,
//         userName: user.name,
//         content: newReview,
//         isVerified: user.isVerified,
//       };
//       const reviewRes = await axios.post(`${config.API_BASE_URL}/professor/${alias}/reviews`, newReviewData);
//       setReviews([...reviews, reviewRes.data]);
//       setNewReview('');
//     } catch (error) {
//       console.error('Error submitting review:', error);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (error) {
//     return <div>{error}</div>;
//   }
//   if (!professor) {
//     return <div>No professor found for this alias</div>;
//   }


//   const pieData = {
//     labels: ['Positive', 'Negative'],
//     datasets: [
//       {
//         label: 'Review Distribution',
//         data: [professor.positive_percentage, professor.negative_percentage],
//         backgroundColor: ['#66bb6a', '#ef5350'], 
//         hoverOffset: 4,
//       },
//     ],
//   };

//   const pieOptions = {
//     plugins: {
//       legend: {
//         position: 'bottom', 
//       },
//     },
//   };

//   const sortedTags = Object.entries(professor.tags || {}).sort((a, b) => b[1] - a[1]);
//   const topTags = sortedTags.slice(0, 3);
//   const otherTags = sortedTags.slice(3);
//   const knownAttributes = ['NAME', 'ALIAS', 'EMAIL', 'total_reviews', 'rating', 'tags', 'href', 'positive_percentage', 'negative_percentage'];

//   const dynamicAttributes = Object.keys(professor).filter(
//     (key) => !knownAttributes.includes(key) && typeof professor[key] === 'string' && key !== '_id' && professor[key] !== ""
//   );
//   const half = Math.ceil(dynamicAttributes.length / 2);
//   const firstHalfAttributes = dynamicAttributes.slice(0, half);
//   const secondHalfAttributes = dynamicAttributes.slice(half);
//   return (
//     <Card sx={{ padding: 2 }}>
//       <CardContent>
//         <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', paddingBottom: 2 }}>
//           {professor.NAME}
//         </Typography>
//         <Grid container spacing={4} paddingBottom={2}>
//           <Grid item xs={12} md={8}>
//             <Box sx={{ backgroundColor: '#2E3B55', padding: 3, borderRadius: 2 }}>
//               <Grid container spacing={4} alignItems="start">
//                 <Grid item xs={6}>
//                   <Box>
//                     <Typography variant="body1" gutterBottom sx={{ color: '#ffffff' }}><strong>Alias</strong>: {professor.ALIAS}</Typography>
//                     <Typography variant="body1" gutterBottom sx={{ color: '#ffffff' }}><strong>Email</strong>: {professor.EMAIL}</Typography>
//                   </Box>
//                   {firstHalfAttributes.map((key) => (
//                     <Typography key={key} variant="body1" gutterBottom sx={{ color: '#ffffff' }}>
//                       <strong>{key.replace(/_/g, ' ')}</strong>: {professor[key]}
//                     </Typography>
//                   ))}
//                 </Grid>
//                 <Grid item xs={6}>
//                   {secondHalfAttributes.map((key) => (
//                     <Typography key={key} variant="body1" gutterBottom sx={{ color: '#ffffff' }}>
//                       <strong>{key.replace(/_/g, ' ')}</strong>: {professor[key]}
//                     </Typography>
//                   ))}
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//           {professor.rating !== "Professor not found" ? 
//             <Box>
//               <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
//                 Rating: {professor.rating}
//               </Typography>
//               <Rating
//                 name="professor-rating"
//                 value={parseFloat(professor.rating)}
//                 precision={0.1}
//                 readOnly
//                 size="large"
//                 icon={<StarIcon fontSize="inherit" />}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 href={professor.href}
//                 target="_blank"
//                 sx={{ marginTop: 2, fontWeight: 'bold', padding: '10px 20px', display: 'block' }}
//               >
//                 Rate My Professors Profile
//               </Button>
//             </Box>
//             :
//             <Typography variant="body2">No Rate My Professor Page exists: Professor is new or profile exists under a different name</Typography> }
//           </Grid> 
//         </Grid>
        
//         { professor.rating !== "Professor not found" && 
//         (professor.rating !== 'N/A' ?
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={4}>
//             <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Review Distribution
//             </Typography>
//             <div style={{ width: '250px', height: '250px', paddingLeft:60 }}>  
//               <Pie 
//                 data={pieData} 
//                 options={pieOptions} 
//               />
//             </div>
//             <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', marginTop: 2 }}>
//                Total Reviews: {professor.total_reviews}
//              </Typography>
//           </Grid>
//           <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', marginLeft: '-20px' }}>
//             <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Top 3 Tags
//             </Typography>
//             <Box sx={{ backgroundColor: '#2E3B55', padding: 2, borderRadius: 2, textAlign: 'center', width: '100%' }}>
//               {topTags.map(([tag, count], index) => (
//                 <Typography key={index} variant="body1" sx={{ color: '#ffffff', marginBottom: 1 }}>
//                   <strong>{Math.round((count / professor.total_reviews) * 100)}%</strong> said <strong>{tag.replace(/_/g, ' ').toUpperCase()}</strong>
//                 </Typography>
//               ))}
//             </Box>
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Other Tags
//             </Typography>
//             {otherTags.length > 0 ? (
//               otherTags.map(([tag], index) => (
//                 <Chip key={index} label={tag.replace(/_/g, ' ')} sx={{ margin: 0.5, backgroundColor: '#2E3B55', color: '#ffffff' }} />
//               ))
//             ) : (
//               <Typography variant="body2">No other tags available</Typography>
//             )}
//           </Grid>
//         </Grid> :
//         <Typography variant="body2">Not enough data for review distributions and tags</Typography> )
//         } 

//         <Grid container spacing={4} sx={{ mt: 4 }}>
//           <Grid item xs={12}>
//             <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Reviews
//             </Typography>

//             {reviews.length > 0 ? (
//               <>
//                 {reviews
//                   .filter(review => review.isVerified)
//                   .map((review) => (
//                     <Card key={review._id} sx={{ marginBottom: 2 }}>
//                       <CardContent>
//                         <Box display="flex" justifyContent="space-between" alignItems="center">
//                           <Typography variant="h6">{review.userName}</Typography>
//                           {user && user.name === review.userName && (
//                             <IconButton onClick={() => handleDeleteReview(review._id)}>
//                               <DeleteIcon />
//                             </IconButton>
//                           )}
//                         </Box>
//                         <Typography variant="body2" color="textSecondary">
//                           {new Date(review.date).toLocaleDateString()}
//                           {review.isVerified && <VerifiedIcon sx={{ color: 'green', ml: 1 }} />}
//                         </Typography>
//                         <Typography variant="body1">{review.content}</Typography>
//                         <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
//                           <IconButton
//                             color={upvotedReviews.includes(review._id) ? 'primary' : 'default'}
//                             onClick={() => handleUpvote(review._id)}
//                           >
//                             <ThumbUpIcon />
//                           </IconButton>
//                           <Typography>{review.upvotes}</Typography>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   ))}

//                 {reviews
//                   .filter(review => !review.isVerified)
//                   .map((review) => (
//                     <Card key={review._id} sx={{ marginBottom: 2 }}>
//                       <CardContent>
//                         <Box display="flex" justifyContent="space-between" alignItems="center">
//                           <Typography variant="h6">{review.userName}</Typography>
//                           {user && user.name === review.userName && (
//                             <IconButton onClick={() => handleDeleteReview(review._id)}>
//                               <DeleteIcon />
//                             </IconButton>
//                           )}
//                         </Box>
//                         <Typography variant="body2" color="textSecondary">
//                           {new Date(review.date).toLocaleDateString()}
//                         </Typography>
//                         <Typography variant="body1">{review.content}</Typography>
//                         <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
//                           <IconButton
//                             color={upvotedReviews.includes(review._id) ? 'primary' : 'default'}
//                             onClick={() => handleUpvote(review._id)}
//                           >
//                             <ThumbUpIcon />
//                           </IconButton>
//                           <Typography>{review.upvotes}</Typography>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   ))}
//               </>
//             ) : (
//               <Typography variant="body2">
//                 No reviews available for this professor yet. Be the first to leave a review!
//               </Typography>
//             )}
//           </Grid>

//           <Grid item xs={12}>
//             <Typography variant="h6">Leave a Review</Typography>
//             <TextField
//               fullWidth
//               label="Your Review"
//               value={newReview}
//               onChange={(e) => setNewReview(e.target.value)}
//               multiline
//               rows={4}
//               variant="outlined"
//               sx={{ mt: 2 }}
//             />
//             <Button onClick={handleSubmitReview} variant="contained" sx={{ mt: 2 }}>
//               Submit Review
//             </Button>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// }

// export default ProfessorDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, Button, Chip, Rating, Box, TextField, IconButton } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'; 
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete'; 
import VerifiedIcon from '@mui/icons-material/Verified';

Chart.register(ArcElement, Tooltip, Legend);

function ProfessorDetails() {
  const { alias } = useParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [user, setUser] = useState(null); 
  const [upvotedReviews, setUpvotedReviews] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfessorAndUser = async () => {
      try {
        const professorRes = await axios.get(`${config.API_BASE_URL}/professor/${alias}`);
        setProfessor(professorRes.data);

        const reviewsRes = await axios.get(`${config.API_BASE_URL}/professor/${alias}/reviews`);
        setReviews(reviewsRes.data);

        const userRes = await axios.get(`${config.API_BASE_URL}/user/full`, { withCredentials: true });
        if (userRes.data.user) {
          setUser(userRes.data.user);
          setUpvotedReviews(userRes.data.user.upvotedReviews); 

        } else {
          navigate('/login'); 
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching professor');
        setLoading(false);
        
      }
    };
    fetchProfessorAndUser();
  }, [alias, navigate]);

  const handleUpvote = async (reviewId) => {
    try {
      const isUpvoted = upvotedReviews.includes(reviewId);
      const newUpvoteData = {
        user: user
      };
      if (!isUpvoted) {
        await axios.post(`${config.API_BASE_URL}/professor/reviews/${reviewId}/upvote`, newUpvoteData);
      } else {
        await axios.post(`${config.API_BASE_URL}/professor/reviews/${reviewId}/remove-upvote`, newUpvoteData);
      }

      setReviews((prevReviews) => 
        prevReviews.map((review) =>
          review._id === reviewId
            ? { ...review, upvotes: isUpvoted ? review.upvotes - 1 : review.upvotes + 1 }
            : review
        )
      );

      if (isUpvoted) {
        setUpvotedReviews(upvotedReviews.filter(id => id !== reviewId)); 
      } else {
        setUpvotedReviews([...upvotedReviews, reviewId]); 
      }
    } catch (error) {
      console.error('Error upvoting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/professor/reviews/${reviewId}`);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
      setUpvotedReviews(upvotedReviews.filter(id => id !== reviewId));

    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim()) return;
    if (!user) {
      navigate('/login'); 
      return;
    }
    try {
      const newReviewData = {
        userEmail: user.email,
        userName: user.name,
        content: newReview,
        isVerified: user.isVerified,
      };
      const reviewRes = await axios.post(`${config.API_BASE_URL}/professor/${alias}/reviews`, newReviewData);
      setReviews([...reviews, reviewRes.data]);
      setNewReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!professor) {
    return <div>No professor found for this alias</div>;
  }


  const pieData = {
    labels: ['Positive', 'Negative'],
    datasets: [
      {
        label: 'Review Distribution',
        data: [professor.positive_percentage, professor.negative_percentage],
        backgroundColor: ['#66bb6a', '#ef5350'], 
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom', 
      },
    },
  };

  const sortedTags = Object.entries(professor.tags || {}).sort((a, b) => b[1] - a[1]);
  const topTags = sortedTags.slice(0, 3);
  const otherTags = sortedTags.slice(3);
  const knownAttributes = ['NAME', 'ALIAS', 'EMAIL', 'total_reviews', 'rating', 'tags', 'href', 'positive_percentage', 'negative_percentage'];

  const dynamicAttributes = Object.keys(professor).filter(
    (key) => !knownAttributes.includes(key) && typeof professor[key] === 'string' && key !== '_id' && professor[key] !== ""
  );
  const half = Math.ceil(dynamicAttributes.length / 2);
  const firstHalfAttributes = dynamicAttributes.slice(0, half);
  const secondHalfAttributes = dynamicAttributes.slice(half);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleTimeString(undefined, options);
  };

  return (
    <Card sx={{ padding: 2 }}>
      <CardContent>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', paddingBottom: 2 }}>
          {professor.NAME}
        </Typography>
        <Grid container spacing={4} paddingBottom={2}>
          <Grid item xs={12} md={8}>
            <Box sx={{ backgroundColor: '#2E3B55', padding: 3, borderRadius: 2 }}>
              <Grid container spacing={4} alignItems="start">
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body1" gutterBottom sx={{ color: '#ffffff' }}><strong>Alias</strong>: {professor.ALIAS}</Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: '#ffffff' }}><strong>Email</strong>: {professor.EMAIL}</Typography>
                  </Box>
                  {firstHalfAttributes.map((key) => (
                    <Typography key={key} variant="body1" gutterBottom sx={{ color: '#ffffff' }}>
                      <strong>{key.replace(/_/g, ' ')}</strong>: {professor[key]}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={6}>
                  {secondHalfAttributes.map((key) => (
                    <Typography key={key} variant="body1" gutterBottom sx={{ color: '#ffffff' }}>
                      <strong>{key.replace(/_/g, ' ')}</strong>: {professor[key]}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {professor.rating !== "Professor not found" ? 
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Rating: {professor.rating}
              </Typography>
              <Rating
                name="professor-rating"
                value={parseFloat(professor.rating)}
                precision={0.1}
                readOnly
                size="large"
                icon={<StarIcon fontSize="inherit" />}
              />
              <Button
                variant="contained"
                color="primary"
                href={professor.href}
                target="_blank"
                sx={{ marginTop: 2, fontWeight: 'bold', padding: '10px 20px', display: 'block' }}
              >
                Rate My Professors Profile
              </Button>
            </Box>
            :
            <Typography variant="body2">No Rate My Professor Page exists: Professor is new or profile exists under a different name</Typography> }
          </Grid> 
        </Grid>
        
        { professor.rating !== "Professor not found" && 
        (professor.rating !== 'N/A' ?
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Distribution
            </Typography>
            <div style={{ width: '250px', height: '250px', paddingLeft:60 }}>  
              <Pie 
                data={pieData} 
                options={pieOptions} 
              />
            </div>
            <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', marginTop: 2 }}>
               Total Reviews: {professor.total_reviews}
             </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', marginLeft: '-20px' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Top 3 Tags
            </Typography>
            <Box sx={{ backgroundColor: '#2E3B55', padding: 2, borderRadius: 2, textAlign: 'center', width: '100%' }}>
              {topTags.map(([tag, count], index) => (
                <Typography key={index} variant="body1" sx={{ color: '#ffffff', marginBottom: 1 }}>
                  <strong>{Math.round((count / professor.total_reviews) * 100)}%</strong> said <strong>{tag.replace(/_/g, ' ').toUpperCase()}</strong>
                </Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Other Tags
            </Typography>
            {otherTags.length > 0 ? (
              otherTags.map(([tag], index) => (
                <Chip key={index} label={tag.replace(/_/g, ' ')} sx={{ margin: 0.5, backgroundColor: '#2E3B55', color: '#ffffff' }} />
              ))
            ) : (
              <Typography variant="body2">No other tags available</Typography>
            )}
          </Grid>
        </Grid> :
        <Typography variant="body2">Not enough data for review distributions and tags</Typography> )
        } 

    <Grid container spacing={4} >
    <Grid item xs={12}>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
    Reviews
  </Typography>

  {reviews.length > 0 ? (
    <>
      <Grid container spacing={4}>
        {reviews
          .filter(review => review.isVerified)
          .map((review) => (
            <Grid item xs={12} md={6} key={review._id}>
              <Card sx={{ marginBottom: 2, border: '10px solid #2E3B55' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VerifiedIcon sx={{ color: 'green' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1 }}>
                      {review.userName}
                    </Typography>
                    {user && user.name === review.userName ? (
                      <IconButton onClick={() => handleDeleteReview(review._id)}>
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <IconButton sx={{ visibility: 'hidden' }}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ marginTop: 1, marginBottom: 2 }}>{review.content}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2">{formatDate(review.date)}</Typography>
                      <Typography variant="body2">{formatTime(review.date)}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        color={upvotedReviews.includes(review._id) ? 'primary' : 'default'}
                        onClick={() => handleUpvote(review._id)}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                      <Typography sx={{ ml: 0.5 }}>{review.upvotes}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {reviews
          .filter(review => !review.isVerified)
          .map((review) => (
            <Grid item xs={12} md={6} key={review._id}>
              <Card sx={{ marginBottom: 2, border: '10px solid #2E3B55' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Invisible Verified Icon for unverified accounts */}
                      <VerifiedIcon sx={{ visibility: 'hidden' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1 }}>
                      {review.userName}
                    </Typography>
                    {user && user.name === review.userName ? (
                      <IconButton onClick={() => handleDeleteReview(review._id)}>
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <IconButton sx={{ visibility: 'hidden' }}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ marginTop: 1, marginBottom: 2 }}>{review.content}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2">{formatDate(review.date)}</Typography>
                      <Typography variant="body2">{formatTime(review.date)}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        color={upvotedReviews.includes(review._id) ? 'primary' : 'default'}
                        onClick={() => handleUpvote(review._id)}
                      >
                        <ThumbUpIcon />
                      </IconButton>
                      <Typography sx={{ ml: 0.5 }}>{review.upvotes}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  ) : (
    <Typography variant="body2">
      No reviews available for this professor yet. Be the first to leave a review!
    </Typography>
  )}
</Grid>


      <Grid item xs={12}>
        <Typography variant="h6">Leave a Review</Typography>
        <TextField
          fullWidth
          label="Your Review"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          multiline
          rows={4}
          variant="outlined"
          sx={{ mt: 2 }}
        />
        <Button onClick={handleSubmitReview} variant="contained" sx={{ mt: 2 }}>
          Submit Review
        </Button>
      </Grid>
      </Grid>

      </CardContent>
    </Card>
  );
}

export default ProfessorDetails;

