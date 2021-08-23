import express from "express";
export const router = express.Router();

import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from "./post.controller.js";

router.route("/")
  .post(/*auth(),*/ createPost)
  .get(getPosts);
router
  .route("/:id")
  .get(getPost)
  .patch(/*auth(),*/ updatePost)
  .delete(/*auth(),*/ deletePost);

export default router;
