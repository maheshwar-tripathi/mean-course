const express = require('express');
const Post = require('../models/post');

const router = express.Router();


router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully!",
      postId: createdPost._id
    });
  });

});

router.put("/:id", (req,res,next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  })
  Post.updateOne({_id: req.params.id}, post).then(updatedPost => {
    res.status(201).json({
      message: "Post updated successfully!"
    });
  });
});

router.get("",(req, res, next) => {
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

router.get("/:id",(req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({message: 'Post not found!'});
    }
  });
});

router.delete("/:id", (req,res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    res.status(200).json({message: "Post deleted!"});
  })
});


module.exports = router;
