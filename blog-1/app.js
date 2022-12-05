const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
// const SESSION_DATA = {}
// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 设置返回格式为 JSON
  res.setHeader('Content-type', 'application/json')

  //获取path
  const url = req.url
  req.path = url.split('?')[0]
  // 解析query
  req.query = querystring.parse(url.split('?')[1])

  //获取 cookie 的过期时间
  const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
  }

  //解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || '' //k1=v1;k2=v2;k3=v3
  cookieStr.split(';').forEach(item => {
    if (!item) return
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  //解析session

  // let needSetCookie = false
  // let userId = req.cookie.userId
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  // } else {
  //   needSetCookie = true
  //   userId = `${Date.now()}_${Math.random()}`
  //   SESSION_DATA[userId] = {}
  // }
  // req.session = SESSION_DATA[userId]

  //// 解析session 使用redis
  let needSetCookie = false
  let userId = req.cookie.userId
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化redis 中的 session值
    set(userId, {})
  }
  //获取 session
  req.sessionId = userId
  get(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化redis 中的 session值
      set(req.sessionId, {})
      req.session = {}
    } else {
      // 设置session
      req.session = sessionData
    }

    // 处理post data
    return getPostData(req)
  }).then(postdata => {
    req.body = postdata
    // 处理blog路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(blogData))
      })
      return
    }

    // 处理user路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(JSON.stringify(userData))
      })
      return
    }
    // 未命中路由
    res.writeHead(404, { "Conten-type": "text/plain" })
    res.write('404 NOT Found\n')
    res.end()

  })


}

module.exports = serverHandle

// process.env.NODE_ENV