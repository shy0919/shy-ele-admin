<template>
  <div id="main" />
</template>

<script setup>
import { onMounted, defineProps, toRefs, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 关闭es-lint对option的默认类型检测，
  // eslint-disable-next-line vue/require-default-prop
  option: {
    type: Object
  }
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

// 监听传入option变化 重新调用setOption来重新绘制
watch(() => option, (newValue, preValue) => {
  myChart.setOption(option.value)
}, { deep: true })

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
