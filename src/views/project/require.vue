<template>
  <div class="photoWall">
    photoWall
    <el-carousel
      ref="imgRef"
      :loop="false"
      :autoplay="false"
      indicator-position="none"
      arrow="never"
      class="carousel"
    >
      <el-carousel-item v-for="(item) in imgList" :key="item.id">
        <el-card :class="[carousel-item,{'border-red':item.warn==1},{'border-green':item.warn==0}]">
          <h2>{{ item.id }}</h2>
        </el-card>
      </el-carousel-item>
    </el-carousel>
    <el-button type="primary" @click="addImg()">add</el-button>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
const imgRef = ref(null)
// const itemRef = ref(null)
const imgList = ref([])

const timer = ref(null)

let num = 0
const addImg = () => {
  num++
  imgList.value.push({ id: `${num}`, warn: 0 })
  nextTick(() => {
    imgRef.value.next()
    console.log(imgRef.value)
  })
  if (imgList.value.length > 6) {
    imgList.value.shift()
  }
}

onMounted(() => {
  // timer = setInterval(() => {
  //   addImg()
  // }, 3000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
::v-deep .el-carousel--horizontal{
  overflow-x:visible
}
::v-deep .el-carousel__item{
  transition: .3s;
  width: 95%;
}
.carousel{
  width: 20%;
  margin-left: 100%;
}
.border-red{
  border: 1px solid red;
}
.border-green{
  border: 1px solid green;
}
.photoWall{
  overflow: hidden;
}
</style>
