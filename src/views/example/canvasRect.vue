<template>
  <div>
    <!-- 默认绘制最多十边形，isrect为true 时 绘制矩形 -->
    <CanvasExp :is-rect="isRect" />
    <el-button type="primary" style="margin-top:20px" @click="isRect = false">点击切换为多边形绘制(最多十边形)，右键取消选点</el-button>
  </div>
</template>

<script setup>
import CanvasExp from './components/canvasExp'
import { ref } from 'vue'

const isRect = ref(true)
</script>

<style lang="scss" scoped>
</style>
