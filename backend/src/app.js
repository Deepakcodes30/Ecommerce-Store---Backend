import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//accepting json directly using express
app.use(express.json({ limit: "16kb" }));

//accepting data from URL where the urlencoder converts and encods URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//accepting files and data
app.use(express.static("public"));

//setting up cookieparser
app.use(cookieParser());

export { app };
