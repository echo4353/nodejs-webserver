// const {add,mul} = require('./a.js')
const opts = require('./a.js')
const add = opts.add
const mul = opts.mul
const sum = add(10, 20)
const sum2 = mul(10, 20)
console.log(sum2)

const _ = require('lodash')
const arr = _.concat([1, 2], 3)
console.log('arr...',arr);