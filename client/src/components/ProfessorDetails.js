
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import Grid from '@mui/material/Grid';
import { Typography, Card, CardContent, Button, Chip, Rating, Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'; 
import StarIcon from '@mui/icons-material/Star';

Chart.register(ArcElement, Tooltip, Legend);
function ProfessorDetails() {
  const { alias } = useParams();
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/professor/${alias}`);
        setProfessor(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching professor:", error);
        setError('Error fetching professor');
        setLoading(false);
      }
    };
    fetchProfessor();
  }, [alias]);
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
      
        
      </CardContent>
      
    </Card>
  );
}
export default ProfessorDetails;
