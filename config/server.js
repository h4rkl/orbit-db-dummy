import apiRoutes from '../api/router.js';
import dotEnv from 'dotenv';
import express from 'express';
import middleware from './middlewares.js';
import orbitInit from "./orbit-db.js";

dotEnv.config();

const app = express();
app.set('db', orbitInit());

middleware(app);

app.use('/api/v1', apiRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

export default app;
