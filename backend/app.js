const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use(cors());

const DB_SOURCE = process.env.MONGO_DB_CONNECT_URL;

mongoose.connect(DB_SOURCE)
.then(() => {
  console.log("Connected to mongodb!");
})
.catch(() => {
  console.log("Connected to mongodb failed!");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);


module.exports = app;
