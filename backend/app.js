const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');
require('dotenv').config();

const app = express();
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(request => {
    res.status(201).json({
      message: "Post added successfully!",
      postId: request._id
    });
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

app.delete("/api/posts/:id", (req,res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    res.status(200).json({message: "Post deleted!"});
  })
});

module.exports = app;
