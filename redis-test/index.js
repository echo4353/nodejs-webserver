const redis = require('redis')

!(async function () {
  //创建客户端
  const redisClient = redis.createClient(6379, '127.0.0.1')

  //连接
  await redisClient.connect()
    .then(() => console.log('redis connect success!'))
    .catch(console.error)

  //set
  await redisClient.set('name', 'zhangsan')
  //get
  const myname = await redisClient.get('name')

  console.log(myname, 'myname')

  //退出
  redisClient.quit()
})()