import app from './config/server.js';

app.listen(process.env.PORT, () => {
  console.log(`Server started | ENV=${process.env.NODE_ENV} | http://localhost:${process.env.PORT}`);
});
