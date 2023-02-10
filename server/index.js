import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/user.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* configurations */
const __filename = fileURLToPath(import.meta.url); // to get the current file name
const __dirname = path.dirname(__filename); // to get the current directory name
dotenv.config(); // to use the .env file
const app = express();

/* middlewares */
app.use(express.json());
app.use(helmet); // to secure the app by setting various HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // to allow cross-origin requests
app.use(morgan("common")); // to log HTTP requests
app.use(bodyParser.json({ limit: "30mb", extended: true })); // to parse JSON bodies
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // to parse URL-encoded bodies
app.use(cors()); // to allow cross-origin requests
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // where the images will be stored

/* file storage */
const storage = multer.diskStorage({
  destination: (req, res, file, cb) => {
    cb(null, "public/assets"); // this is where the images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // this is the name of the image
  },
});

const upload = multer({ storage }); // this is the middleware that will be used to upload the images

/* routes with files */
app.post("/auth/register", upload.single("picture"), register); // upload.single("picture") is the middleware that will be used to upload the images locally
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* other routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
/* mongoose setup */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    //  Add Data once
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log("no connection", error.message));
