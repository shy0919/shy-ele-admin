<template>
  <div>
    <canvas id="myCanvas" ref="myCanvas" />
  </div>
</template>

<script>
import { onMounted } from 'vue'

let ctx

export default {
  name: '',
  setup() {
    const initCanvas = () => {
      var canvas = document.querySelector('#myCanvas')
      ctx = canvas.getContext('2d')
      drawSmile()
    }
    const drawSmile = () => {
      ctx.beginPath()
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true) // 绘制轮廓
      ctx.moveTo(110, 75)
      ctx.arc(75, 75, 35, 0, Math.PI, false) // 口(顺时针)
      ctx.moveTo(65, 65)
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true) // 左眼
      ctx.moveTo(95, 65)
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true) // 右眼
      ctx.stroke()
    }
    onMounted(() => {
      initCanvas()
    })
    return {
      initCanvas
    }
  }

}
</script>

<style scoped lang='scss'>
#myCanvas{
  width: 400px;
  height: 200px;
  background-color: pink;
}
</style>
