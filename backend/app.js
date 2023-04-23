const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save();
  // console.log(post);

  res.status(201).json({
    message: "Post added successfully!"
  });
});

app.get("/api/posts",(req, res, next) => {
  Post.find()
    .then(results => {
      res.status(200).json({
        message: "Posts get successfully!",
        posts: results
      });
    })
    .catch(error => {
      console.log(error);
    });
});


module.exports = app;
