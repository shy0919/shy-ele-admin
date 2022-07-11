<template>
  <div>
    <!-- 默认绘制最多十边形，isrect为true 时 绘制矩形 -->
    <CanvasExp :is-rect="true" />
  </div>
</template>

<script setup>
import CanvasExp from './components/canvasExp'
</script>

<style lang="scss" scoped>
</style>
