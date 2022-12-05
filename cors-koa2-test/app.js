const Koa = require('koa')
const cors = require('koa-cors')

const app = new koa()

//CORS 允许跨越

app.use(
    cors({
        origin: '*' // 或设置单个 origin
        //其他配置参考 http://www.npmjs.com/package/cors
    })
)


app.use(async ctx => {
  ctx.body = {
    errno: 0,
    msg:'CORS koa2'
  }
})

app.listen(8000, () => {
    console.log('koa-server is runnig on port 8000');
})