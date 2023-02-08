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
