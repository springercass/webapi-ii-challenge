const express = require("express");

const server = express();
server.use(express.json());

const port = 5000;
server.listen(port, () => {
  console.log(`\n** API running on ${port} **`);
});

server.get("/", (req, res) => {
  res.send(`
      <h2>Lambda Hubs API</h>
      <p>Welcome to the Lambda Hubs API</p>
    `);
});
