<template>
  <div class="bread-crumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in breadList" :key="index" :to="{ path: item.path }">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'BreadCrumb',
  setup() {
    const route = useRoute()

    const breadList = computed(() => {
      let list = []
      route.matched.forEach((el) => {
        if (el.meta.title) {
          const listItem = {
            name: el.meta.title,
            path: el.path
          }
          list.push(listItem)
        }
      })
      if (list[0].name !== '首页') {
        list = [{
          name: '首页',
          path: '/'
        }].concat(list)
      }
      return list
    })

    return {
      breadList
    }
  }

})
</script>

<style scoped lang='scss'>
.bread-crumb {
      position: sticky;
      top: 50px;
      left: 220px;
      padding: 10px;
      background-color: #baccd9;
      text-align: left;
    }
</style>
