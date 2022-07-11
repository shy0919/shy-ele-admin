<template>
  <div>
    <div id="divCanvas">
      <canvas id="graphCanvas" />
      <canvas id="personCanvas" />
      <canvas id="pointCanvas" />
    </div>
    <span class="dialog-footer">
      <el-button @click="onClose()">取 消</el-button>
      <el-button @click="drawAxisList(pointArr)">确 定</el-button>
      <el-button @click="clearView()">清 除</el-button>
    </span>
  </div>
</template>

<script setup type="text/javascript" defer=true>
import { ref, onMounted, defineProps, toRefs } from 'vue'

const props = defineProps({
  isRect: Boolean
})
const { isRect } = toRefs(props)
// console.log(isRect.value)
// 画图相关
// 画布宽高
const canvasWidth = ref(1050)
const canvasHeight = ref(550)
// 画点数量
let pointNum = isRect.value ? 2 : 10

// 点的范围
const pointRange = ref(10)

// 拖动点的范围
const pointRangeDrag = ref(50)

// 线条颜色
const colorVal = ref('rgba(255,0,0,1)')

// 填充颜色
const colorValA = ref('rgba(255,0,0,.1)')

// 坐标文字颜色
const colorValPoint = ref('rgba(0,255,0,1)')

// 线条粗细,画笔大小
const lineWidthVal = ref(2)
// 人的坐标数组
// const personArr = ref([0.13, 24, 15, 23])

let canGraph = HTMLCanvasElement
let ctxGragh = CanvasRenderingContext2D
let canPoint = HTMLCanvasElement
let ctxPoint = CanvasRenderingContext2D
let canPerson = HTMLCanvasElement
let ctxPerson = CanvasRenderingContext2D

const isMouseDown = ref(false)
const isMouseUp = ref(false)
const isMouseMove = ref(false)
const isDrag = ref(false)
// 拖动的点
const dragPosition = ref(-1)

const pointArr = ref([])

// 清除
const clearView = () => {
  ctxGragh.clearRect(0, 0, canGraph.width, canGraph.height)
  ctxPoint.clearRect(0, 0, canPoint.width, canPoint.height)
  pointArr.value = []
  pointNum = isRect.value ? 2 : 10
}

// canOnClick
const canOnClick = (e) => {
  if (pointArr.value.length < pointNum) {
    let piX, piY
    // eslint-disable-next-line prefer-const
    piX = e.offsetX === undefined ? e.clientX : e.offsetX
    // eslint-disable-next-line prefer-const
    piY = e.offsetY === undefined ? e.clientY : e.offsetY
    if (pointArr.value.length === 0) {
      pointArr.value.push({ x: piX, y: piY })
    } else {
      // 此点是否已经存在数组中
      let isExist = false
      for (let i = 0; i < pointArr.value.length; i++) {
        if (
          piX >= pointArr.value[i].x - pointRange.value &&
          piX <= pointArr.value[i].x + pointRange.value &&
          piY >= pointArr.value[i].y - pointRange.value &&
          piY <= pointArr.value[i].y + pointRange.value
        ) {
          // 判断为同一点，不存储
          // console.log('此点已存在')
          isExist = true
          break
        }
      }
      if (!isExist) {
        pointArr.value.push({ x: piX, y: piY })
      }
    }
    drawArea()
  }
}

const canOnmouseUp = (e) => {
  // console.log('鼠标抬起', e)
  if (isDrag.value) {
    // 这里来减少点
    pointArrMerge()
    drawArea()
    isDrag.value = false
    dragPosition.value = -1
  }
}

const canOnmouseMove = (e) => {
  // console.log("鼠标移动", e)
  ctxPoint.clearRect(0, 0, canPoint.width, canPoint.height)
  let piX, piY
  piX = e.offsetX === undefined ? e.clientX : e.offsetX
  piY = e.offsetY === undefined ? e.clientY : e.offsetY

  piX = piX <= 0 ? 0 : piX
  piY = piY <= 0 ? 0 : piY
  piX = piX >= canPoint.width ? canPoint.width : piX
  piY = piY >= canPoint.height ? canPoint.height : piY

  drawMoveArea(piX, piY)

  dot(piX, piY)
  // 显示点坐标
  pointShow(piX, piY)

  // 判断是否是拖动
  if (isMouseDown.value && isMouseMove.value && !isMouseUp.value && !isRect.value) {
    if (isDrag.value) {
      drawDragArea(piX, piY)
    } else {
      dragPoint(piX, piY)
    }
  }
}
const canOnmouseDown = (e) => {
  // console.log('鼠标按下', e)
}

// ============================
// 删除重复的点
const pointArrMerge = () => {
  for (let i = 0; i < pointArr.value.length; i++) {
    for (let j = i + 1; j < pointArr.value.length; j++) {
      if (
        pointArr.value[i].x >= pointArr.value[j].x - pointRange.value &&
        pointArr.value[i].x <= pointArr.value[j].x + pointRange.value &&
        pointArr.value[i].y >= pointArr.value[j].y - pointRange.value &&
        pointArr.value[i].y <= pointArr.value[j].y + pointRange.value
      ) {
        pointArr.value.splice(i, 1)
      }
    }
  }
}

// 鼠标下画点
const dot = (x, y) => {
  ctxPoint.clearRect(0, 0, canPoint.width, canPoint.height)
  ctxPoint.beginPath()
  ctxPoint.arc(x <= 0 ? 0 : x, y, lineWidthVal.value, 0, 2 * Math.PI)
  ctxPoint.fillStyle = colorVal.value
  ctxPoint.fill()
}

// 画区域
const drawArea = () => {
  ctxGragh.clearRect(0, 0, canGraph.width, canGraph.height)
  ctxGragh.beginPath()
  ctxGragh.moveTo(pointArr.value[0].x, pointArr.value[0].y)
  if (isRect.value) {
    ctxGragh.lineTo(pointArr.value[0].x, pointArr.value[1].y)
    ctxGragh.lineTo(pointArr.value[1].x, pointArr.value[1].y)
    ctxGragh.lineTo(pointArr.value[1].x, pointArr.value[0].y)
  } else {
    for (let i = 1; i < pointArr.value.length; i++) {
      ctxGragh.lineTo(pointArr.value[i].x, pointArr.value[i].y)
    }
  }
  ctxGragh.strokeStyle = colorVal.value
  ctxGragh.fillStyle = colorValA.value
  ctxGragh.lineWidth = lineWidthVal.value
  ctxGragh.closePath()
  ctxGragh.stroke()
  // ctxGragh.fill()
}

// 画移动的矩形
const drawMoveRect = (x, y) => {
  ctxGragh.beginPath()
  ctxGragh.moveTo(pointArr.value[0].x, pointArr.value[0].y)
  if (x <= 0) {
    x = 0
  }
  ctxGragh.lineTo(pointArr.value[0].x, y)
  ctxGragh.lineTo(x, y)
  ctxGragh.lineTo(x, pointArr.value[0].y)
  // ctxGragh.lineTo(x, y)
  ctxGragh.strokeStyle = colorVal.value
  ctxGragh.fillStyle = colorValA.value
  ctxGragh.lineWidth = lineWidthVal.value
  ctxGragh.closePath()
  ctxGragh.stroke()
}

// 画移动的区域
const drawMoveArea = (x, y) => {
  // console.log(x, y)
  if (pointArr.value.length > 0 && pointArr.value.length < pointNum) {
    ctxGragh.clearRect(0, 0, canGraph.width, canGraph.height)
    if (isRect.value) {
      drawMoveRect(x, y)
      return
    }
    ctxGragh.beginPath()
    ctxGragh.moveTo(pointArr.value[0].x, pointArr.value[0].y)
    for (let i = 1; i < pointArr.value.length; i++) {
      ctxGragh.lineTo(pointArr.value[i].x, pointArr.value[i].y)
    }
    if (x <= 0) {
      x = 0
    }
    ctxGragh.lineTo(x, y)
    ctxGragh.strokeStyle = colorVal.value
    ctxGragh.fillStyle = colorValA.value
    ctxGragh.lineWidth = lineWidthVal.value
    ctxGragh.closePath()
    ctxGragh.stroke()
    // ctxGragh.fill()
  }
}

// 显示点的坐标
const pointShow = (x, y) => {
  let i = -1
  let text
  if (pointArr.value.length > 0) {
    for (i = 0; i < pointArr.value.length; i++) {
      text =
        i + '(' + pointArr.value[i].x + ',' + pointArr.value[i].y + ')'
      textCanShow(pointArr.value[i].x, pointArr.value[i].y, text)
    }
    if (i < pointNum) {
      text = i + '(' + x + ',' + y + ')'
      textCanShow(x, y, text)
    }
  } else {
    text = 0 + '(' + x + ',' + y + ')'
    textCanShow(x, y, text)
  }
}

// 显示文字
const textCanShow = (x, y, text) => {
  // 需要判断4个角，防止文字显示不到
  // 左上角
  ctxPoint.beginPath()
  if (x < 50) {
    ctxPoint.textAlign = 'left'
  } else if (x > canPoint.width - 50) {
    ctxPoint.textAlign = 'right'
  } else {
    ctxPoint.textAlign = 'center'
  }

  if (y > canPoint.height - 50) {
    // 点在下面，文字在上面
    ctxPoint.textBaseline = 'bottom'
  } else {
    ctxPoint.textBaseline = 'top'
  }
  ctxPoint.font = "normal 12pt '黑体'"
  ctxPoint.fillStyle = colorValPoint.value
  ctxPoint.fillText(text, x, y)
  // 右上角
  // 左下角
  // 右下角
}

const dragPoint = (x, y) => {
  // console.log('拖动')
  for (let i = 0; i < pointArr.value.length; i++) {
    if (
      x >= pointArr.value[i].x - pointRangeDrag.value &&
      x <= pointArr.value[i].x + pointRangeDrag.value &&
      y >= pointArr.value[i].y - pointRangeDrag.value &&
      y <= pointArr.value[i].y + pointRangeDrag.value
    ) {
      dragPosition.value = i
      isDrag.value = true
      // console.log('拖动', i)
    }
  }
}

const drawDragArea = (x, y) => {
  if (dragPosition.value !== -1) {
    pointArr.value.splice(dragPosition.value, 1, { x, y })
    drawArea()
  }
}

// 有带改进 一个来监听personArr.value 来画
// const drawPersonArr = () => {
//   ctxPerson.clearRect(0, 0, canPerson.width, canPerson.height)
//   if (personArr.value.length > 0) {
//     ctxPerson.beginPath()
//     ctxPerson.rect(canPerson.width - 260, 10, 260, (personArr.value.length + 1) * 25)
//     ctxPerson.font = "normal 18pt '黑体'"
//     ctxPerson.fillStyle = colorValPoint.value
//     ctxPerson.fillText('个数：' + personArr.value.length, canPerson.width - 110, 40)
//     for (let i = 0; i < personArr.value.length; i++) {
//       // textCanShow(canPerson.width-125,40+i*10,i+":"+personArr.value[i])
//       ctxPerson.fillText(i + ':' + JSON.stringify(personArr.value[i]), canPerson.width - 245, (40 + ((i + 1) * 20)))
//     }
//     ctxPerson.closePath()
//     ctxPerson.stroke()
//   }
// }

// const setPersonArr = (arr) => {
//   if (arr != null) {
//     if (arr.length > 0) {
//       personArr.value = arr
//       drawPersonArr()
//     }
//   }
// }

onMounted(() => {
  setTimeout(() => {
    canGraph = document.getElementById('graphCanvas')
    ctxGragh = canGraph.getContext('2d')
    canPoint = document.getElementById('pointCanvas')
    ctxPoint = canPoint.getContext('2d')
    canPerson = document.getElementById('personCanvas')
    ctxPerson = canPerson.getContext('2d')

    canGraph.width = canvasWidth.value
    canGraph.height = canvasHeight.value
    canPoint.width = canvasWidth.value
    canPoint.height = canvasHeight.value
    canPerson.width = canvasWidth.value
    canPerson.height = canvasHeight.value

    ctxGragh.strokeStyle = colorVal.value // 线条颜色
    ctxGragh.lineWidth = lineWidthVal.value // 线条粗细
    ctxPoint.strokeStyle = colorVal.value // 线条颜色
    ctxPoint.lineWidth = lineWidthVal.value // 线条粗细
    ctxPerson.strokeStyle = colorVal.value // 线条颜色
    ctxPerson.lineWidth = lineWidthVal.value // 线条粗细

    canPoint.onmouseup = (e) => {
      // console.log("鼠标抬起", e);
      isMouseUp.value = true
      isMouseMove.value = false
      isMouseDown.value = false
      canOnmouseUp(e)
    }
    canPoint.onmousemove = (e) => {
      isMouseMove.value = true
      // console.log("鼠标移动",e);
      // if (isRect.value) return
      canOnmouseMove(e)
    }
    canPoint.onmousedown = (e) => {
      // console.log("鼠标按下", e)
      isMouseDown.value = true
      isMouseUp.value = false
      canOnmouseDown(e)
    }
    canPoint.onclick = (e) => {
      // console.log("鼠标点击", e);
      canOnClick(e)
    }
    canPoint.oncontextmenu = (e) => {
      // console.log('鼠标右键', e)
      // canOnClick(e)
      if (isRect.value) return false
      pointNum = pointArr.value.length
      drawArea()
      // 屏蔽浏览器自带右键菜单
      return false
    }
    // setPersonArr(axis.value)
  })
})
</script>

<style scoped>
#divCanvas {
  position: relative;
  height: 550px;
}

#graphCanvas,
#personCanvas {
  position: absolute;
  left: 0;
  top: 0;
}

#pointCanvas {
  position: absolute;
  left: 0;
  top: 0;
  border: 1px solid red;
  cursor: crosshair;
}
</style>
