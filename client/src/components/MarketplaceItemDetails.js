import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    IconButton,
    Modal,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MarketplaceItemDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const item = state?.item;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!item) {
        return (
            <Typography
                sx={{
                    textAlign: 'center',
                    mt: 5,
                    fontSize: '1.2rem',
                    color: '#6B7280',
                }}
            >
                No item details available.
            </Typography>
        );
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
        );
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Box
            sx={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '20px',
                backgroundColor: '#f4f4f9',
                borderRadius: '8px',
                boxShadow: 3,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    color: '#2E3B55',
                    textAlign: 'center',
                    mb: 2,
                }}
            >
                {item.title}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    mb: 3,
                }}
            >
                {/* Image Carousel */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '50%',
                    }}
                >
                    {item.images && item.images.length > 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative',
                                cursor: 'pointer',
                            }}
                            onClick={handleImageClick}
                        >
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreviousImage();
                                }}
                                sx={{
                                    position: 'absolute',
                                    left: '-20px',
                                    color: '#2E3B55',
                                    backgroundColor: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: '#eeeeee',
                                    },
                                }}
                            >
                                <ArrowBackIosIcon />
                            </IconButton>
                            <img
                                src={item.images[currentImageIndex]}
                                alt={`Item ${currentImageIndex + 1}`}
                                style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNextImage();
                                }}
                                sx={{
                                    position: 'absolute',
                                    right: '-20px',
                                    color: '#2E3B55',
                                    backgroundColor: '#ffffff',
                                    '&:hover': {
                                        backgroundColor: '#eeeeee',
                                    },
                                }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Typography
                            sx={{
                                color: '#6B7280',
                                fontStyle: 'italic',
                            }}
                        >
                            No images available.
                        </Typography>
                    )}
                </Box>

                {/* Item Details */}
                <Box
                    sx={{
                        width: '50%',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: '#2E3B55',
                            mb: 1,
                        }}
                    >
                        Price: ${item.price}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: '#2E3B55',
                            mb: 1,
                        }}
                    >
                        Description:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#6B7280',
                            mb: 2,
                        }}
                    >
                        {item.description}
                    </Typography>
                </Box>
            </Box>

            {/* Modal for Full Image View */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'white',
                        padding: 2,
                        boxShadow: 24,
                        borderRadius: 2,
                        maxHeight: '90vh',
                        maxWidth: '90vw',
                        overflow: 'auto',
                        textAlign: 'center',
                    }}
                >
                    <img
                        src={item.images[currentImageIndex]}
                        alt={`Item ${currentImageIndex + 1}`}
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                        }}
                    />
                    <Button
                        onClick={handleCloseModal}
                        sx={{
                            marginTop: 2,
                            backgroundColor: '#2E3B55',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1F2C43',
                            },
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>

            {/* Seller and Additional Information */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                }}
            >
                {/* Seller Information */}
                <Card
                    sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: '#ffffff',
                        boxShadow: 2,
                        borderRadius: '8px',
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: '#2E3B55',
                                mb: 1,
                            }}
                        >
                            Seller Information
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                mb: 0.5,
                            }}
                        >
                            <strong>Name:</strong> {item.sellerName || 'Not available'}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                mb: 0.5,
                            }}
                        >
                            <strong>Email:</strong> {item.sellerEmail || 'Not available'}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                mb: 0.5,
                            }}
                        >
                            <strong>Phone:</strong> {item.sellerContact || 'Not available'}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Additional Information */}
                <Card
                    sx={{
                        flex: 1,
                        padding: 3,
                        backgroundColor: '#ffffff',
                        boxShadow: 2,
                        borderRadius: '8px',
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: '#2E3B55',
                                mb: 1,
                            }}
                        >
                            Additional Information
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                mb: 0.5,
                            }}
                        >
                            <strong>Purchase Modes:</strong>{' '}
                            {item.purchaseMode && item.purchaseMode.length > 0
                                ? item.purchaseMode.join(', ')
                                : 'Not specified'}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#6B7280',
                                mb: 0.5,
                            }}
                        >
                            <strong>Payment Methods:</strong>{' '}
                            {item.paymentMethods && item.paymentMethods.length > 0
                                ? item.paymentMethods.join(', ')
                                : 'Not specified'}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Button
                variant="contained"
                sx={{
                    marginTop: 3,
                    backgroundColor: '#2E3B55',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#1F2C43',
                    },
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
                onClick={() => navigate(-1)} // Go back to the previous page
            >
                Back to Marketplace
            </Button>
        </Box>
    );
};

export default MarketplaceItemDetails;
