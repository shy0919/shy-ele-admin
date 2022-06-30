<template>
  <div>
    <div id="chart" />
  </div>

</template>

<script>
import { onBeforeMount, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([GridComponent, BarChart, CanvasRenderer])

export default {
  name: '',
  setup() {
    const chartInit = () => {
      // 基于准备好的dom，初始化echarts实例.
      var myChart = echarts.init(document.getElementById('chart'), null, {
        width: 600,
        height: 400
      })
      // 绘制图表
      myChart.setOption({
        title: {
          text: '销售'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      })
    }
    onBeforeMount(() => {

    })
    onMounted(() => {
      chartInit()
    })
    return {
      chartInit
    }
  }

}
</script>

<style scoped lang='scss'>
#chart{
  width: fit-content;
  margin: 0 auto;
}
</style>
