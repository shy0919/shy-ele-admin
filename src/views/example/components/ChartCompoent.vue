<template>
  <div id="main" />
</template>

<script setup>
import { onMounted, defineProps, toRefs, watch, unref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 关闭es-lint对option的默认类型检测，
  // eslint-disable-next-line vue/require-default-prop
  option: {
    type: Object
  },
  isDark: {
    type: Boolean
  }
})
const { option, isDark } = toRefs(props)

let myChart = null

const initChart = () => {
  const chartDom = document.getElementById('main')
  myChart = echarts.init(chartDom, isDark.value ? 'dark' : '')
  // option要去掉代理才能传入setOption,可以通过重新调用setOption来绘制新图; vue3拿ref的值也可以用unref(),unref(ref) === isRef(ref) ? ref.value:ref
  myChart.setOption(unref(option))
  // 添加监听事件，使charts跟随页面大小重绘
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 监听传入option变化 重新调用setOption来重新绘制
watch(() => option, (newValue, preValue) => {
  myChart.setOption(option.value)
}, { deep: true })

// 监听isDark,变更是否暗黑模式
watch(isDark, (newValue, preValue) => {
  // 销毁echarts实例后重新初始化
  myChart.dispose()
  initChart()
})

onMounted(() => {
  initChart()
})

</script>

<style scoped lang="scss">
#main {
  width: 100%;
  height: 100%;
  // background-color: #ddd;
}
</style>
