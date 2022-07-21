<template>
  <div class="">
    <el-button type="" @click="clickE">调用fnA</el-button>
    <el-button type="" @click="eval('fnB')">调用fnB</el-button>
    <el-button type="" @click="eval('fnC')">调用fnC</el-button>
  </div>
</template>

<script setup>
import { } from 'vue'

const fnA = () => {
  alert('调用fnA成功')
}
const fnB = () => {
  alert('调用fnA成功')
}
const fnC = () => {
  alert('调用fnA成功')
}
const clickE = () => {
  eval('fnA()')
}
// 封装的一个eval替代品
// const evalFn = (fn) => {
//   console.log(fn)
//   const Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
//   return new Fn(`return ${fn}`)()
// }
// const eval2 = fn => {
//   var Fun = Function // 一个变量指向Function，防止有些前端编译工具报错
//   // console.log(new Fun('return ' + fn)())
//   return new Fun('return ' + fn)()
// }
console.log('失败', fnA, fnB, fnC)

</script>

<style scoped lang="scss">
</style>
