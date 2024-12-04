import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import moment from 'moment';

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedPurchaseModes, setSelectedPurchaseModes] = useState([]);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);
    const purchaseModes = ['Shipping', 'In-person'];
    const paymentMethods = ['Cash', 'Card', 'Venmo', 'Zelle'];
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(!userId);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/api/marketplace`);
                setItems(response.data);
                setFilteredItems(response.data);
            } catch (error) {
                console.error('Error fetching marketplace items:', error);
            }
        };
        fetchItems();
        if (!userId) {
            axios.get(`${config.API_BASE_URL}/user/`, { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUserId(response.data.user.id);
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [navigate, userId]);
    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        applyFilters(query, minPrice, maxPrice, selectedPurchaseModes, selectedPaymentMethods);
    };

    const applyFilters = (query, minPrice, maxPrice, purchaseModes, paymentMethods) => {
        let filtered = items;

        if (query) {
            filtered = filtered.filter(
                (item) =>
                    item.title.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
            );
        }

        if (minPrice !== '' || maxPrice !== '') {
            filtered = filtered.filter(
                (item) =>
                    (!minPrice || item.price >= parseFloat(minPrice)) &&
                    (!maxPrice || item.price <= parseFloat(maxPrice))
            );
        }

        if (purchaseModes.length > 0) {
            filtered = filtered.filter((item) =>
                item.purchaseMode.some((mode) => purchaseModes.includes(mode))
            );
        }

        if (paymentMethods.length > 0) {
            filtered = filtered.filter((item) =>
                item.paymentMethods.some((method) => paymentMethods.includes(method))
            );
        }

        setFilteredItems(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        if (filterType === 'purchaseMode') {
            setSelectedPurchaseModes(value);
            applyFilters(searchQuery, minPrice, maxPrice, value, selectedPaymentMethods);
        } else if (filterType === 'paymentMethod') {
            setSelectedPaymentMethods(value);
            applyFilters(searchQuery, minPrice, maxPrice, selectedPurchaseModes, value);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedPurchaseModes([]);
        setSelectedPaymentMethods([]);
        setFilteredItems(items);
    };

    const handleViewDetails = (item) => {
        navigate(`/marketplace/item/${item._id}`, { state: { item, userId} });
    };
    
    const handleCreateListing = () => {
        navigate(`/marketplace/create`);
    };

    return (
        <div>
            <Box
                sx={{
                    position: 'relative',
                    mb: 3,
                    color: '#2E3B55',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: '#2E3B55',
                        textAlign: 'center',
                    }}
                >
                    Purdue Marketplace
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#2E3B55',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#1F2C43',
                        },
                    }}
                    onClick={handleCreateListing}
                >
                    Create Listing
                </Button>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    variant="outlined"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        mx: 'auto',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#2E3B55',
                            },
                            '&:hover fieldset': {
                                borderColor: '#2E3B55',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2E3B55',
                            },
                        },
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            type="number"
                            label="Min Price"
                            value={minPrice}
                            onChange={(e) => {
                                setMinPrice(e.target.value);
                                applyFilters(searchQuery, e.target.value, maxPrice, selectedPurchaseModes, selectedPaymentMethods);
                            }}
                            sx={{ width: 110 }}
                        />
                        <TextField
                            type="number"
                            label="Max Price"
                            value={maxPrice}
                            onChange={(e) => {
                                setMaxPrice(e.target.value);
                                applyFilters(searchQuery, minPrice, e.target.value, selectedPurchaseModes, selectedPaymentMethods);
                            }}
                            sx={{ width: 110 }}
                        />
                    </Box>

                    <FormControl
                        sx={{
                            minWidth: 175,
                            '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
                        }}
                    >
                        <InputLabel
                            shrink={selectedPurchaseModes.length > 0 || false} 
                            sx={{
                                color: 'rgba(0, 0, 0, 0.6)',
                                background: '#eeeeee', 
                                px: 1, 
                                transform: selectedPurchaseModes.length
                                    ? 'translate(14px, -7px) scale(.75)'
                                    : 'translate(14px, 16px) scale(1)', 
                                transition: 'all 0.2s ease-out', 
                            }}
                        >
                            Purchase Modes
                        </InputLabel>
                        <Select
                            multiple
                            value={selectedPurchaseModes}
                            onChange={(e) => handleFilterChange('purchaseMode', e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#f4f4f9', 
                                        color: '#2E3B55', 
                                    },
                                },
                            }}
                        >
                            {purchaseModes.map((mode) => (
                                <MenuItem key={mode} value={mode}>
                                    <Checkbox checked={selectedPurchaseModes.includes(mode)} />
                                    <ListItemText primary={mode} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl
                        
                        sx={{
                            '& .MuiInputLabel-root': { color: 'rgba(0, 0, 0, 0.6)' },
                            minWidth: 185,
                        }}
                    >
                        <InputLabel
                            shrink={selectedPaymentMethods.length > 0 || false} 
                            sx={{
                                color: 'rgba(0, 0, 0, 0.6)',
                                background: '#eeeeee',
                                px: 1, 
                                transform: selectedPaymentMethods.length
                                    ? 'translate(14px, -7px) scale(.75)' 
                                    : 'translate(14px, 16px) scale(1)', 
                                transition: 'all 0.2s ease-out', 
                            }}
                        >
                            Payment Methods
                        </InputLabel>
                        <Select
                            multiple
                            value={selectedPaymentMethods}
                            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#f4f4f9', 
                                        color: '#2E3B55', 
                                    },
                                },
                            }}
                        >
                            {paymentMethods.map((method) => (
                                <MenuItem key={method} value={method}>
                                    <Checkbox checked={selectedPaymentMethods.includes(method)} />
                                    <ListItemText primary={method} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                  
                    <Button
                        variant="outlined"
                        sx={{
                            color: 'rgba(0, 0, 0, 0.6)', 
                            borderColor: 'rgba(0, 0, 0, 0.6)', 
                            '&:hover': {
                                borderColor: 'rgba(0, 0, 0, 0.6)',
                                backgroundColor: 'rgba(0, 0, 0, 0.04)', 
                            },
                        }}
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card
                                sx={{
                                    boxShadow: 3,
                                    borderRadius: '8px',
                                    backgroundColor: '#f4f4f9',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        transition: 'transform 0.3s ease-in-out',
                                    },
                                    height: 500,
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 300,
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: item.images && item.images.length > 0 ? 'transparent' : '#d3d3d3',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <Typography
                                            sx={{
                                                color: '#2E3B55',
                                            }}
                                        >
                                            No images
                                        </Typography>
                                    )}
                                </Box>
                                <CardContent
                                    sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#2E3B55',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#2E3B55',
                                                    fontSize: '1.2rem',
                                                }}
                                            >
                                                ${item.price}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#6B7280',
                                                mb: 2,
                                                lineHeight: '1.8',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                minHeight: '3.6em',
                                            }}
                                        >
                                            {item.description}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#6B7280',
                                                mb: 2,
                                            }}
                                        >
                                            Posted: {moment(item.createdAt).format('MMMM Do YYYY, h:mm A')}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#2E3B55',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#1F2C43',
                                                },
                                            }}
                                            onClick={() => handleViewDetails(item)}
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography
                        sx={{
                            textAlign: 'center',
                            color: '#6B7280',
                            mt: 5,
                            width: '100%',
                        }}
                    >
                        No listings found.
                    </Typography>
                )}
            </Grid>
        </div>
    );
};

export default Marketplace;
