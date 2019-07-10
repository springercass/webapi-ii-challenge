const express = require("express");

const postsRouter = require('./posts/posts-router.js');

const server = express();

const port = 5000;
server.listen(port, () => {
  console.log(`\n** API running on ${port} **`);
});

server.use('/api/posts', postsRouter);

server.get("/", (req, res) => {
  res.send(`
      <h2>posts API</h>
      <p>welcome</p>
    `);
});
