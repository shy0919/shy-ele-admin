<template>
  <div class="page-music">
    <audio ref="audio" :src="current.url" autoplay @play="play" @pause="pause" @canplaythrough="canplaythrough" @ended="ended" />
    <!-- 播放栏 -->
    <div class="top">
      <div class="play" @click="toogle">{{ `${!isPlay?'播放':'暂停'}` }}</div>
      <div style="width: 5%;">列表循环</div>
      <div class="slider-demo-block">
        <span class="demonstration">{{ time.current }}/{{ time.end }}</span>
        <el-slider v-model="progress" :step="0.1" :format-tooltip="formatTooltip" @change="drag(progress)" />
      </div>
      <h3 style="margin-right:10px;width:9%;">{{ current.title }}</h3>
      <div style="margin-right:60px;width: 4%;">{{ current.singer }}</div>
      <span style="margin-right:10px;cursor: pointer;" @click="cut('last')">上一首</span>
      <span style="margin-right:10px;cursor: pointer;" @click="cut('next')">下一首</span>
    </div>
    <!-- 歌单 -->
    <div class="music-list">
      <el-row :gutter="20">
        <el-col :span="1">序号</el-col>
        <el-col :span="6">标题</el-col>
        <el-col :span="6">歌手</el-col>
        <el-col :span="6">时长</el-col>
        <el-col :span="1">操作</el-col>
      </el-row>
      <el-row v-for="(item,index) in musicList" :key="item.title" :gutter="20" class="music-item">
        <el-col :span="1">
          {{ index+1 }}
        </el-col>
        <el-col :span="6">{{ item.title }}</el-col>
        <el-col :span="6">{{ item.singer }}</el-col>
        <el-col :span="6">{{ item.time }}</el-col>
        <el-col :span="1" class="play" @click="playThis(index)">播放</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import musicMune from '@/api/music.js'
export default {
  name: 'Music',
  setup() {
    const musicList = reactive(musicMune)
    var current = reactive({})
    const audio = ref(null)
    const progress = ref(0)
    const isPlay = ref(false)
    let timer = null
    const time = reactive({
      current: '00:00',
      end: '00:00'
    })
    const drag = (progress) => {
      audio.value.currentTime = audio.value.duration * progress / 100
      time.current = shift(audio.value.currentTime)
    }
    const toogle = () => {
      if (audio.value.paused) {
        audio.value.play()
        isPlay.value = true
      } else {
        audio.value.pause()
        isPlay.value = false
      }
    }
    const play = () => {
      if (timer) clearInterval(timer)
      timer = setInterval(() => {
        time.current = shift(audio.value.currentTime + 0.1)
        progress.value = audio.value.currentTime / audio.value.duration * 100
      }, 1000)
    }
    const pause = () => {
      clearInterval(timer)
    }
    const canplaythrough = () => {
      time.end = shift(audio.value.duration)
    }
    const ended = () => {
      cut('next')
    }
    const playThis = (index) => {
      current.title = musicList[index].title
      current.singer = musicList[index].singer
      current.time = musicList[index].time
      current.url = musicList[index].url
      current.index = index
      isPlay.value = true
    }
    const cut = (val) => {
      let nextPlayIndex = current.index
      if (val === 'next') {
        nextPlayIndex += 1
        nextPlayIndex = nextPlayIndex === musicList.length ? 0 : nextPlayIndex
      } else {
        nextPlayIndex -= 1
        nextPlayIndex = nextPlayIndex < 0 ? musicList.length - 1 : nextPlayIndex
      }
      // console.log(musicList.length)
      playThis(nextPlayIndex)
    }

    // 时间转换（分：秒）
    const shift = (time) => {
      const temp = Math.floor(time)
      return `${parseInt(temp / 60) >= 10 && parseInt(temp / 60) <= 59 ? parseInt(temp / 60) : '0' + parseInt(temp / 60)}:${parseInt(temp % 60) >= 10 && parseInt(temp % 60) <= 59 ? parseInt(temp % 60) : '0' + parseInt(temp % 60)}`
    }
    // 格式化滑块提示
    const formatTooltip = (val) => {
      return audio?.value?.duration ? shift(val / 100 * audio?.value?.duration) : time.current
    }
    onMounted(() => {
      // console.log(musicList)
    })
    return {
      audio,
      progress,
      time,
      isPlay,
      current,
      musicList,
      formatTooltip,
      drag,
      play,
      pause,
      canplaythrough,
      ended,
      toogle,
      playThis,
      cut
    }
  }

}
</script>

<style scoped lang='scss'>
.page-music{
  width: 100%;
  height: 100%;
  .top{
    width: 100%;
    display: flex;
    // justify-content: center;
    align-items: center;
  }
}
    .play{
      width: 3vw;
      height: 3vh;
      font-size: 20px;
      line-height: 3vh;
      border-radius: 50%;
      border: 1px solid #333;
      cursor: pointer;
    }
.slider-demo-block {
  width: 70%;
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  margin: 0 4vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 80%;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.music-list{
  height: 90%;
  padding: 20px;
  .title{
    display: flex;

  }
  .music-item{
    display: flex;
    justify-content: left;
    align-items: center;
    height: 8%;
    border-bottom: 1px solid #333;
  }
}
</style>
