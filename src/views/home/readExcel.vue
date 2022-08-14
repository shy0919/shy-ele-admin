<template>
  <div class="">
    <el-upload class="upload-demo" action='' drag :auto-upload="false" :on-change="uploadChange" :limit="1">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script setup>
import { } from 'vue'
import xlsx from 'xlsx';
import { readFile } from '@/utils/readFile.js'; //下文有该文件代码

const uploadChange = async (file) => {
  let dataBinary = await readFile(file.raw)
  let workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
  let workSheet = workBook.Sheets[workBook.SheetNames[0]]
  const data = xlsx.utils.sheet_to_json(workSheet)
  console.log(data)
}
</script>

<style scoped lang="scss">
</style>