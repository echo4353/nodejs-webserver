const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]
  const query = querystring.parse(url.split('?')[1])
  // 设置返回格式为 JSON
  res.setHeader('Content-type', 'application/json')
  // 返回的数据
  const resData = {
    method,
    url,
    path,
    query
  }
  // 处理get请求
  if (method === 'GET') {
    res.end(JSON.stringify(resData))
  }
  // 处理post请求
  if (method === 'POST') {
    //数据格式
    console.log('content-type', req.headers['content-type']);
    //接收数据
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      resData.postData = postData
      console.log(postData,'postData');
      res.end(JSON.stringify(resData)) // 在这里返回，因为是异步
    })
  }
})




server.listen(8001)
console.log('服务启动');