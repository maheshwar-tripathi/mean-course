const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  const post = req.body;
  console.log(post);

  res.status(201).json({
    message: "Post added successfully!"
  });
});

app.get("/api/posts",(req, res, next) => {
  const posts = [
    {
      id: "p_12345",
      title: "First post from node server",
      content: "The post is coming from node server."
    },
    {
      id: "p_98765",
      title: "Second post from node server",
      content: "The post is coming from node server!"
    },
    {
      id: "p_432567",
      title: "Third post from node server",
      content: "The final post is coming from node server!"
    }
  ]

  res.status(200).json({
    message: "Posts get successfully!",
    posts: posts
  });
});


module.exports = app;
