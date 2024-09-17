import mongoose from "mongoose";
import "dotenv/config";

const connection = {};

async function connect() {
  if (connection.isConnected) {
    return;
  } 
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

export default connect;