import express from "express";
import cors from "cors";
import courses from "./routes/course.js";
import "dotenv/config";

const PORT = 5001; // carmens is 5000
const app = express();

app.use(cors());
app.use(express.json());
app.use("/course", courses);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});