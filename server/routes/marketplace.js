// routes/marketplace.js
import express from 'express';
import {
    createListing,
    getListings,
    searchListings,
    deleteListing,
    updateListing
} from '../controllers/marketplace.js';

const router = express.Router();

router.post('/', createListing);
router.get('/', getListings);
router.get('/search', searchListings);
router.delete('/:id', deleteListing);
router.put('/:id', updateListing);

export default router;
