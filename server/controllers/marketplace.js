// controllers/marketplace.js
import MarketplaceItem from '../models/MarketplaceItem.js';

export const createListing = async (req, res) => {
    try {
        const { images, ...rest } = req.body;

        const processedImages = images.map((image) => {
            if (!image.startsWith('data:image/')) {
                throw new Error('Invalid image format');
            }
            return image;
        });

        const item = new MarketplaceItem({ ...rest, images: processedImages });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const getListings = async (req, res) => {
    try {
        const items = await MarketplaceItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchListings = async (req, res) => {
    try {
        const { query, category } = req.query;
        const filter = {};
        if (query) filter.title = { $regex: query, $options: 'i' };
        if (category) filter.purchaseMode = category;

        const items = await MarketplaceItem.find(filter);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        await MarketplaceItem.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await MarketplaceItem.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
