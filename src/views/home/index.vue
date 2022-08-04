<template>
  <div>
    <el-button v-permission="['low', 'editor', 'super', 'admin']">
      low
    </el-button>
    <el-button v-permission="['medium', 'super', 'admin']">
      medium
    </el-button>
    <el-button v-permission="['super', 'admin']">
      admin
    </el-button>
    <el-button v-permission="['editor', 'super', 'admin']">
      editor
    </el-button>
    <el-button v-permission="['super']">
      super
    </el-button>
    <vue3-json-excel :json-data="json_data" :fields="fields">
      <el-button>组件导出excel</el-button>
    </vue3-json-excel>
    <el-button @click="exportExcel()">xlsx导出excel</el-button>
    <div>
      {{ store.otherStoreCount }}
    </div>
    <el-button @click="store.countPlusOneAsync">延时一秒 store的count++</el-button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from "vue"
import { useStore } from "@/store/index.js";

const store = useStore()

const json_data = ref([{
  name: 'Tom',
  idNumber: '13125',
  age: '24',
  firstTime: '09:20',
  lastTime: '18:32',
  attendanceStatus: '正常'
},
{
  name: 'Tom',
  idNumber: '13125',
  age: '24',
  firstTime: '09:20',
  lastTime: '18:32',
  attendanceStatus: '正常'
}])
const fields = ref({
  '姓名': 'name',
  '年龄': 'age'
})
const exportExcel = () => {
  // 从vue-element-admin 《借鉴》来的导出excel; data必须传二维数组[[],[]]
  import('@/utils/Export2Excel').then(excel => {
    // excel表示导入的模块对象
    // console.log(excel)
    excel.export_json_to_excel({
      header: ['姓名', '工资'], // 表头 必填
      data: [
        ['刘备', 100],
        ['关羽', 500]
      ], // 具体数据 必填
      filename: 'excel-list', // 文件名称
      autoWidth: true, // 宽度是否自适应
      bookType: 'xlsx' // 生成的文件类型
    })
  })

}
onBeforeMount(() => {

})
onMounted(() => {

})

</script>

<style scoped lang='scss'>
</style>
