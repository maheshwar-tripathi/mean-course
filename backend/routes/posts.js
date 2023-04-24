const express = require('express');

const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png':  'png',
  'image/jpeg': 'jpg',
  'image/jpg':  'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if(isValid) {
      error = null;
    }
    callBack(null, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  var domainUrl = req.protocol +"://"+ req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: domainUrl + '/images/' + req.file.filename
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  });

});

router.put("/:id", multer({storage: storage}).single("image"), (req,res,next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    var domainUrl = req.protocol +"://"+ req.get("host");
    imagePath = domainUrl + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });

  Post.updateOne({_id: req.params.id}, post).then(updatedPost => {
    res.status(201).json({
      message: "Post updated successfully!",
      imagePath: imagePath
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
