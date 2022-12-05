const redis = require('redis')  //v 4.x
const { REDIS_CONF } = require('../conf/db')

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

//连接  启动后立即执行
!(async function () {
  await redisClient.connect()
    .then(() => console.log('redis connect success!'))
    .catch(console.error)
})()

//set 
const set = async (key, val) => {
  let objVal
  if (typeof val === 'object') {
    objVal = JSON.stringify(val)
  } else {
    objVal = val
  }
  await redisClient.set(key, objVal)
}
//get 
const get = async (key) => {
  const value = await redisClient.get(key)
  if (!value) {
    return null
  }
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }

}

module.exports = {
  set,
  get
}