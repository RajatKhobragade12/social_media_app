const express = require('express');
const router = express.Router();

const { register, login } = require("../controllers/userController");
const { createPost, postList, deletePost, likePost, postInfo } = require("../controllers/postController");
const { createComment, commentList } = require("../controllers/commentController");

router.post("/register", register);
router.post("/login", login);


router.post('/posts', createPost);
router.get('/posts', postList);
router.get('/posts/:id', postInfo);
router.delete('/posts/:id', deletePost);
router.post('/posts/:id/likes', likePost);
router.post('/posts/:id/comments', createComment);
router.get('/posts/:id/comments', commentList);


module.exports = router;