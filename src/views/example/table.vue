<template>
  <emit-prop @son="sonprop" />
</template>

<script setup>
import {} from 'vue'
import emitProp from './emitProp.vue'
const sonprop = () => {
  console.log('111')
}
</script>

<style scoped></style>
