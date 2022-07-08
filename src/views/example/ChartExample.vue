<template>
  <div id="main" />
</template>

<script setup>
import { onMounted, defineProps, toRefs } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: Object
})
const { option } = toRefs(props)

let myChart = null
const initChart = () => {
  const chartDom = document.getElementById('main')
  myChart = echarts.init(chartDom)
  // option要去掉代理才能传入setOption,可以通过重新调用setOption来绘制新图
  myChart.setOption(option.value)

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
onMounted(() => {
  initChart()
})

</script>

<style scoped lang="scss">
#main {
  width: 100%;
  height: 100%;
  background-color: #ddd;
}
</style>
