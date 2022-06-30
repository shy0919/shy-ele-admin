<template>
  <div>
    首页
    <el-button v-permission="['low','editor','super','admin']">
      low
    </el-button>
    <el-button v-permission="['medium','super','admin']">
      medium
    </el-button>
    <el-button v-permission="['super','admin']">
      admin
    </el-button>
    <el-button v-permission="['editor','super','admin']">
      editor
    </el-button>
    <el-button v-permission="['super']">
      super
    </el-button>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
export default {
  name: '',
  setup() {
    const data = reactive({})
    onBeforeMount(() => {

    })
    onMounted(() => {

    })
    return {
      ...toRefs(data)
    }
  }

}
</script>

<style scoped lang='scss'>

</style>
