const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  res.end('<h1>hello world</h1>')
})

server.listen(9000, () => {
  console.log('listening on 9000 port');
})