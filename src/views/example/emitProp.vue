<template>
  <el-button class="emit" @click="son()">
    son
  </el-button>
</template>

<script setup>
import { defineEmits } from 'vue'
const emit = defineEmits(['son'])
const son = () => {
  emit('son')
}
</script>

<style scoped></style>
