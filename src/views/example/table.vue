<template>
  <div>
    <emit-prop @son="sonprop" />
    <div class="chart">
      <ChartCompoent :option="option" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emitProp from './emitProp.vue'
import ChartCompoent from './components/ChartCompoent'
const sonprop = () => {
  console.log('111')
  option.value.series[0].data[0].value -= 300
}
const option = ref({
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 2048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 20vh;
}
</style>
