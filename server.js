// Using the HTTP Module
const http = require('http'),
fs = require('fs'),
url = require('url');

// Create a server to allow requests and send responses.
http.createServer((request, response) => {
  var addr = request.url,
  q = url.parse(addr, true), 
  filePath = '';

  // Evaluates the url, if it contains "documentation", set the file path to the documentation html page
  if (q.pathname.includes('documentation')) { 
    filePath = (__dirname + '/documentation.html');
  } 
  else {
    filePath = (__dirname + '/index.html');
  }

  // Returns the requested documentation site if spelled correctly, or the index site for all other requests
  if (filePath != '') {
    fs.readFile(filePath, function(err, data) {

      if (err) {
        throw err;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();

    }); 
  }

  // LOG SECTION

  // Below if statement bypasses favicon requests from being written to the log
  if (!q.pathname.includes('favicon')) {
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('URL Request has been recorded');
      }
    }); 
  }

}).listen(8080);
