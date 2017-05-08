const server = require("http").createServer((request, response) => {
  console.log("wesh");
  response.end("wesh");
});

server.listen(4646);
