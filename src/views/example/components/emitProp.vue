<template>
  <el-button class="emit" @click="son()">
    点击修改echarts数据
  </el-button>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['son'])
const son = () => {
  emit('son')
}
</script>

<style scoped>
</style>
