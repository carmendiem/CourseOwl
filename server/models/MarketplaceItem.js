// models/MarketplaceItem.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const marketplaceItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    sellerName:{type: String},
    sellerEmail:{type: String},
    sellerContact:{type: Number},
    images: [String], 
    purchaseMode: [String],
    paymentMethods: [String],
    sellerId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
}, { timestamps: true,
    collection: 'marketplaceItems',
 });

const MarketplaceItem = mongoose.models.MarketplaceItem || mongoose.model('MarketplaceItem', marketplaceItemSchema);
export default MarketplaceItem;