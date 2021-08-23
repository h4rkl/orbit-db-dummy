import { nextTick } from "process";
import { v4 as uuidv4 } from "uuid";

export const createPost = async (req, res, next) => {
  const { postsDb } = await req.app.get('db');
  const { post } = req.body;
  try {
    const newPost = await postsDb.add({ wallet: uuidv4(), post });
    return res.json({ post: { id: newPost }});
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  const { postsDb } = await req.app.get('db');
  try {
    const posts = postsDb.all;
    res.json({ posts });
  } catch (error) {
    next(error);
  }
}

export const getPost = (req, res) => {
  const { id } = req.params;
  res.json({ post: id });
}

export const updatePost = (req, res) => {
  const { id } = req.params;
  const postBody = req.body.post;
  res.json({ post: id });
}

export const deletePost = (req, res) => {
  res.json({ post: 'deletePost' });
}
