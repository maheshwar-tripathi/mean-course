const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const postRoutes = require('./routes/posts');

const app = express();
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use(cors());

const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect("mongodb+srv://maheshwar2005-github:"+DB_PASSWORD+"@mongo-mean-app-data.r4ciqts.mongodb.net/node-angular?retryWrites=true&w=majority")
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
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);


module.exports = app;
