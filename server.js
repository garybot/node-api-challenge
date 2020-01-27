const express = require('express');
const projectRouter = require('./projectRouter.js');

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda API Sprint Challenge</h>
    <p>Welcome to the Lambda Projects API</p>
  `);
})

server.use('/api/projects', projectRouter);

module.exports = server;