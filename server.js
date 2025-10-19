// Import required modules
const http = require('http');
const url = require('url');

// Create the server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // Parse the URL to extract query parameters
  const queryObject = url.parse(req.url, true).query;

  // Check if "name" parameter is given
  if (queryObject.name) {
    res.end(`Hello, ${queryObject.name}!\n`);
  } else {
    res.end('Hello, Stranger!\n');
  }
});

// Start the server
server.listen(3000, 'localhost', () => {
  console.log('Server running at http://localhost:3000/');
});
