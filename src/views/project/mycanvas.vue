<template>
  <div>
    <div class="manager_detail">
      <el-row class="my-row">
        <el-col :span="2" :offset="1">
          <div class="operation-left">
            <div class="operation-item" :class="{ active: currentType === 'default' }" @click="typeChange('default')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/kuangxuan.png" alt=""> -->
              <span class="operation-desc">框选</span>
            </div>
            <div class="operation-item" :class="{ active: currentType === 'rect' }" @click="typeChange('rect')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/juxing.png" alt=""> -->
              <span class="operation-desc">矩形</span>
            </div>
            <div class="operation-item" :class="{ active: currentType === 'circle' }" @click="typeChange('circle')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/yuanxing.png" alt=""> -->
              <span class="operation-desc">圆形</span>
            </div>
            <div class="operation-item" :class="{ active: currentType === 'ellipse' }" @click="typeChange('ellipse')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/tuoyuanxing.png" alt=""> -->
              <span class="operation-desc">椭圆形</span>
            </div>
            <div class="operation-item" :class="{ active: currentType === 'triangle' }" @click="typeChange('triangle')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/triangle.png" alt=""> -->
              <span class="operation-desc">三角形</span>
            </div>
          </div>
        </el-col>
        <el-col id="canvas-box" :span="16">
          <canvas id="canvas" />
        </el-col>
        <el-col :span="2">
          <div class="operation-right">
            <div class="operation-item" :class="{ active: currentType === 'line' }" @click="typeChange('line')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/segment.png" alt=""> -->
              <span class="operation-desc">线段</span>
            </div>
            <div class="operation-item" :class="{ active: currentType === 'polyline' }" @click="typeChange('polyline')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/zhexian.png" alt=""> -->
              <span class="operation-desc">折线</span>
            </div>
            <div class="operation-item" :class="{ active: currentType === 'polygon' }" @click="typeChange('polygon')">
              <!-- <img class="operation-img" src="@/assets/canvas-img/polygon.png" alt=""> -->
              <span class="operation-desc">多边形</span>
            </div>
            <div class="operation-item danger" @click="doClear">
              <!-- <img class="operation-img" src="@/assets/canvas-img/qingkongshanchu.png" alt=""> -->
              <span class="operation-desc">一键清空</span>
            </div>
            <div class="operation-item save" @click="doSave">
              <!-- <img class="operation-img" src="@/assets/canvas-img/baocun.png" alt=""> -->
              <span class="operation-desc">保存</span>
            </div>
          </div>
        </el-col>
        <el-col :span="2" :offset="1">
          <h3>使用说明</h3>
          <p>1. 调整图形大小/旋转: 需切换到 "框选"</p>
          <p>2. "结束"折线,多边形: 双击鼠标左键即可</p>
          <p>3. 移动"单个"图形位置: 切换到 默认(框选) 框选住移动即可</p>
          <p>4. 移动"所有"图形位置: 按住"空格键"左击移动即可</p>
          <p>注: 使用Fabric.js</p>
          <p>官网地址: http://fabricjs.com/</p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { fabric } from 'fabric'
export default {
  name: 'Mycanvas',
  components: {},
  data() {
    return {
      // 动态设置容器宽高值
      screenWidth: 1000,
      screenHeight: 0,
      currentType: 'default', // 当前select选中项value
      selectOptions: [
        {
          value: 'default',
          label: '默认(框选)'
        },
        {
          value: 'rect',
          label: '矩形'
        },
        {
          value: 'circle',
          label: '圆形'
        },
        {
          value: 'ellipse',
          label: '椭圆形'
        },
        {
          value: 'triangle',
          label: '三角形'
        },
        {
          value: 'line',
          label: '线段'
        },
        {
          value: 'polyline',
          label: '折线'
        },
        {
          value: 'polygon',
          label: '多边形'
        }
      ],
      spaceKeyState: false, // 空格键是否被按住: true按住; false松开
      downPoint: null, // 鼠标按下的坐标 {x: 0, y: 0}
      upPoint: null, // 鼠标松开的坐标 {x: 0, y: 0}
      canvas: null, // 画板
      currentCircle: null, // 临时圆，创建圆的时候使用
      currentEllipse: null, // 临时椭圆，创建椭圆时使用
      currentTriangle: null, // 临时三角形，创建三角形时使用
      currentLine: null, // 临时线段
      currentPolyline: null, // 临时折线
      currentPolygon: null // 临时多边形
    }
  },
  watch: {},
  created() { },
  mounted() {
    const canvasBox = document.getElementById('canvas-box')
    this.screenWidth = canvasBox.offsetWidth
    this.screenHeight = window.screen.availHeight - 220
    this.initCanvas()
    window.addEventListener('keydown', this.keyDown, false)
    window.addEventListener('keyup', this.keyUp, false)
  },
  methods: {
    // 初始化画板
    initCanvas() {
      // 1. 实例化canvas 画布
      this.canvas = new fabric.Canvas('canvas', {
        width: this.screenWidth, // 画布宽度
        height: this.screenHeight, // 画布高度
        backgroundColor: '#fff' // 画布背景色
      })
      this.canvas.on('mouse:down', this.canvasMouseDown) // 鼠标在画布上按下
      this.canvas.on('mouse:move', this.canvasMouseMove) // 鼠标在画布上移动
      this.canvas.on('mouse:up', this.canvasMouseUp) // 鼠标在画布上松开
      this.canvas.on('mouse:wheel', this.canvasMouseWheel) // 鼠标滚轮在画布上的事件
      this.canvas.on('mouse:dblclick', this.canvasMouseDblclick)
    },
    doClear() {
      this.$confirm('该操作不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.canvas.clear()
          this.$message({
            type: 'success',
            message: '清空成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消~'
          })
        })
    },
    doSave() {
      this.$message.info('功能暂未开放,敬请期待~')
    },
    // 画布操作类型切换
    typeChange(opt) {
      this.currentType = opt
      switch (opt) {
        case 'default':
          this.canvas.selection = true
          this.setSelectionStyle()
          this.canvas.skipTargetFind = false // 允许选中
          break
        case 'rect':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            lineWidth: 1
          })
          this.canvas.skipTargetFind = true // 禁止选中
          break
        case 'circle':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'transparent',
            lineWidth: 0
          })
          this.canvas.skipTargetFind = true
          break
        case 'ellipse':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'transparent',
            lineWidth: 0
          })
          this.canvas.skipTargetFind = true // 禁止选中
          break
        case 'triangle':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'transparent',
            lineWidth: 0
          })
          this.canvas.skipTargetFind = true // 禁止选中
          break
        case 'line':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'transparent',
            lineWidth: 0
          })
          this.canvas.skipTargetFind = true // 禁止选中
          break
        case 'polyline':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'transparent',
            lineWidth: 0
          })
          this.canvas.skipTargetFind = true // 禁止选中
          break
        case 'polygon':
          this.setSelectionStyle({
            color: 'transparent',
            borderColor: 'transparent',
            lineWidth: 0
          })
          this.canvas.skipTargetFind = true // 禁止选中
          break
        default:
          this.setSelectionStyle()
          break
      }
    },
    // 设置选框样式
    setSelectionStyle(options = {}) {
      this.canvas.selectionColor = options.color || 'rgba(100, 100, 255, 0.3)'
      this.canvas.selectionBorderColor =
        options.borderColor || 'rgba(255, 255, 255, 0.3)'
      this.canvas.selectionLineWidth = options.lineWidth || 1
      this.canvas.selectionDashArray = options.dashArray || []
    },
    // 创建矩形
    createRect() {
      // 点击事件，不生成矩形
      if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
        return
      }

      // 创建矩形
      // 矩形参数计算
      const top = Math.min(this.downPoint.y, this.upPoint.y)
      const left = Math.min(this.downPoint.x, this.upPoint.x)
      const width = Math.abs(this.downPoint.x - this.upPoint.x)
      const height = Math.abs(this.downPoint.y - this.upPoint.y)

      // 矩形对象
      const rect = new fabric.Rect({
        top,
        left,
        width,
        height,
        fill: 'transparent',
        stroke: '#000'
      })

      // 将矩形添加到画布上
      this.canvas.add(rect)
      // 选中刚创建的矩形createEllipse
      // this.canvas.setActiveObject(rect)

      this.downPoint = null
      this.upPoint = null
    },
    // 创建圆形
    createCircle(e) {
      this.currentCircle = new fabric.Circle({
        top: this.downPoint.y,
        left: this.downPoint.x,
        radius: 0,
        fill: 'transparent',
        stroke: 'rgba(0, 0, 0, 0.2)'
      })

      this.canvas.add(this.currentCircle)
    },

    // 修改当前正在创建的圆
    changeCurrentCircleOpt(e) {
      const currentPoint = e.absolutePointer

      const radius =
        Math.min(
          Math.abs(this.downPoint.x - currentPoint.x),
          Math.abs(this.downPoint.y - currentPoint.y)
        ) / 2
      const top =
        currentPoint.y > this.downPoint.y
          ? this.downPoint.y
          : this.downPoint.y - radius * 2
      const left =
        currentPoint.x > this.downPoint.x
          ? this.downPoint.x
          : this.downPoint.x - radius * 2

      this.currentCircle.set('radius', radius)
      this.currentCircle.set('top', top)
      this.currentCircle.set('left', left)

      this.canvas.requestRenderAll()
    },

    // 创建椭圆
    createEllipse(e) {
      this.currentEllipse = new fabric.Ellipse({
        top: this.downPoint.y,
        left: this.downPoint.x,
        rx: 0,
        ry: 0,
        fill: 'transparent',
        stroke: 'rgba(0, 0, 0, 0.2)'
      })
      this.canvas.add(this.currentEllipse)
    },

    // 修改当前正在创建的椭圆
    changeCurrentEllipseOpt(e) {
      const currentPoint = e.absolutePointer

      const rx = Math.abs(this.downPoint.x - currentPoint.x) / 2
      const ry = Math.abs(this.downPoint.y - currentPoint.y) / 2

      const top =
        currentPoint.y > this.downPoint.y
          ? this.downPoint.y
          : this.downPoint.y - ry * 2
      const left =
        currentPoint.x > this.downPoint.x
          ? this.downPoint.x
          : this.downPoint.x - rx * 2

      this.currentEllipse.set('rx', rx)
      this.currentEllipse.set('ry', ry)
      this.currentEllipse.set('top', top)
      this.currentEllipse.set('left', left)
      this.canvas.requestRenderAll()
    },

    // 创建三角形
    createTriangle(e) {
      this.currentTriangle = new fabric.Triangle({
        top: this.downPoint.y,
        left: this.downPoint.x,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: 'rgba(0, 0, 0, 0.2)'
      })
      this.canvas.add(this.currentTriangle)
    },

    // 修改当前正在创建的三角形
    changeCurrentTriangle(e) {
      const currentPoint = e.absolutePointer

      const width = Math.abs(this.downPoint.x - currentPoint.x)
      const height = Math.abs(this.downPoint.y - currentPoint.y)

      const top =
        currentPoint.y > this.downPoint.y ? this.downPoint.y : currentPoint.y
      const left =
        currentPoint.x > this.downPoint.x ? this.downPoint.x : currentPoint.x

      this.currentTriangle.set('width', width)
      this.currentTriangle.set('height', height)
      this.currentTriangle.set('top', top)
      this.currentTriangle.set('left', left)
      this.canvas.requestRenderAll()
    },

    // 创建线段
    createLine(e) {
      this.currentLine = new fabric.Line(
        [
          this.downPoint.x,
          this.downPoint.y, // 起始点坐标
          this.downPoint.x,
          this.downPoint.y // 结束点坐标
        ],
        {
          stroke: 'rgba(0, 0, 0, 0.2)' // 笔触颜色
        }
      )
      this.canvas.add(this.currentLine)
    },

    // 修改当前正在创建的线段
    changeCurrentLine(e) {
      const currentPoint = e.absolutePointer
      // console.log(currentLine)
      this.currentLine.set('x2', currentPoint.x)
      this.currentLine.set('y2', currentPoint.y)

      this.canvas.requestRenderAll()
    },

    // 创建折线
    createPolyline(e) {
      const currentPoint = e.absolutePointer
      this.currentPolyline = new fabric.Polyline(
        [
          { x: currentPoint.x, y: currentPoint.y },
          { x: currentPoint.x, y: currentPoint.y }
        ],
        {
          fill: 'transparent',
          stroke: 'rgba(0, 0, 0, 0.2)',
          objectCaching: false
        }
      )
      this.canvas.add(this.currentPolyline)
    },

    // 修改当前正在创建的折线
    changeCurrentPolyline(e) {
      const currentPoint = e.absolutePointer

      const points = this.currentPolyline.points

      points.push({
        x: currentPoint.x,
        y: currentPoint.y
      })
      this.canvas.requestRenderAll()
    },

    // 折线橡皮带
    changePolylineBelt(e) {
      const currentPoint = e.absolutePointer
      const points = this.currentPolyline.points

      points[points.length - 1].x = currentPoint.x
      points[points.length - 1].y = currentPoint.y

      this.canvas.requestRenderAll()
    },

    // 完成折线绘制
    finishPolyline(e) {
      const currentPoint = e.absolutePointer
      const points = this.currentPolyline.points
      points[points.length - 1].x = currentPoint.x
      points[points.length - 1].y = currentPoint.y

      points.pop()
      points.pop()
      this.canvas.remove(this.currentPolyline)
      if (points.length > 1) {
        const polyline = new fabric.Polyline(points, {
          stroke: '#000',
          fill: 'transparent'
        })

        this.canvas.add(polyline)
      }
      this.currentPolyline = null

      this.canvas.requestRenderAll()
    },

    // 创建多边形
    createPolygon(e) {
      const currentPoint = e.absolutePointer
      this.currentPolygon = new fabric.Polygon(
        [
          { x: currentPoint.x, y: currentPoint.y },
          { x: currentPoint.x, y: currentPoint.y }
        ],
        {
          fill: 'transparent',
          stroke: 'rgba(0, 0, 0, 0.2)',
          objectCaching: false
        }
      )
      this.canvas.add(this.currentPolygon)
    },

    // 修改当前正在创建的多边形
    changeCurrentPolygon(e) {
      const currentPoint = e.absolutePointer

      const points = this.currentPolygon.points

      points.push({
        x: currentPoint.x,
        y: currentPoint.y
      })
      this.canvas.requestRenderAll()
    },

    // 多边形橡皮带
    changePolygonBelt(e) {
      const currentPoint = e.absolutePointer
      const points = this.currentPolygon.points

      points[points.length - 1].x = currentPoint.x
      points[points.length - 1].y = currentPoint.y

      this.canvas.requestRenderAll()
    },

    // 完成多边形绘制
    finishPolygon(e) {
      const currentPoint = e.absolutePointer
      const points = this.currentPolygon.points
      points[points.length - 1].x = currentPoint.x
      points[points.length - 1].y = currentPoint.y

      points.pop()
      points.pop()
      this.canvas.remove(this.currentPolygon)
      if (points.length > 1) {
        const polygon = new fabric.Polygon(points, {
          stroke: '#000',
          fill: 'transparent'
        })

        this.canvas.add(polygon)
      }

      this.currentPolygon = null
      this.canvas.requestRenderAll()
    },
    // 鼠标在画布上按下
    canvasMouseDown(e) {
      console.log('e', e)
      if (this.spaceKeyState) {
        // 按住空格时，鼠标指针是抓
        this.canvas.setCursor('grabbing')
      }

      this.downPoint = e.absolutePointer
      if (this.spaceKeyState) {
        this.canvas.isDragging = true
        this.canvas.lastPosX = e.e.clientX
        this.canvas.lastPosY = e.e.clientY
        this.canvas.selection = false // 移动时不出现框选样式
      } else {
        switch (this.currentType) {
          case 'circle':
            this.createCircle(e)
            break
          case 'ellipse':
            this.createEllipse(e)
            break
          case 'triangle':
            this.createTriangle(e)
            break
          case 'line':
            this.createLine(e)
            break
          case 'polyline':
            if (this.currentPolyline === null) {
              this.createPolyline(e)
            } else {
              this.changeCurrentPolyline(e)
            }
            break
          case 'polygon':
            if (this.currentPolygon === null) {
              this.createPolygon(e)
            } else {
              this.changeCurrentPolygon(e)
            }
            break
        }
      }
    },
    // 鼠标在画布上移动
    canvasMouseMove(e) {
      if (this.spaceKeyState) {
        // 按住空格时，鼠标指针是手掌
        this.canvas.setCursor('grab')
      }

      // 拖拽画布
      if (this.canvas.isDragging) {
        // 拖拽时，鼠标指针是抓
        this.canvas.setCursor('grabbing')
        const vpt = this.canvas.viewportTransform // 聚焦视图的转换
        vpt[4] += e.e.clientX - this.canvas.lastPosX
        vpt[5] += e.e.clientY - this.canvas.lastPosY
        this.canvas.requestRenderAll()
        this.canvas.lastPosX = e.e.clientX
        this.canvas.lastPosY = e.e.clientY
      } else {
        switch (this.currentType) {
          case 'circle':
            this.currentCircle && this.changeCurrentCircleOpt(e)
            break
          case 'ellipse':
            this.currentEllipse && this.changeCurrentEllipseOpt(e)
            break
          case 'triangle':
            this.currentTriangle && this.changeCurrentTriangle(e)
            break
          case 'line':
            this.currentLine && this.changeCurrentLine(e)
            break
          case 'polyline':
            this.currentPolyline && this.changePolylineBelt(e)
            break
          case 'polygon':
            this.currentPolygon && this.changePolygonBelt(e)
            break
        }
      }
    },

    // 鼠标在画布上松开
    canvasMouseUp(e) {
      this.upPoint = e.absolutePointer

      if (this.spaceKeyState) {
        this.canvas.setCursor('grab')
      }

      if (this.canvas.isDragging) {
        this.canvas.setViewportTransform(this.canvas.viewportTransform) // 设置此画布实例的视口转换
        this.canvas.isDragging = false
        this.canvas.selection = true // 移动结束后还原框选样式
        return
      }

      switch (this.currentType) {
        case 'default': // 框选
          break
        case 'rect': // 创建矩形
          this.createRect()
          break
        case 'circle': // 创建圆形
          if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
            this.canvas.remove(this.currentCircle)
          } else {
            if (this.currentCircle) {
              this.currentCircle.set('stroke', '#000')
            }
          }
          this.currentCircle = null
          break
        case 'ellipse': // 创建椭圆
          if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
            this.canvas.remove(this.currentEllipse)
          } else {
            if (this.currentEllipse) {
              this.currentEllipse.set('stroke', '#000')
            }
            this.currentEllipse = null
          }
          break
        case 'triangle': // 创建三角形
          if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
            this.canvas.remove(this.currentTriangle)
          } else {
            if (this.currentTriangle) {
              this.currentTriangle.set('stroke', '#000')
            }
            this.currentTriangle = null
          }
          break
        case 'line': // 创建线段
          if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
            this.canvas.remove(this.currentLine)
          } else {
            if (this.currentLine) {
              this.currentLine.set('stroke', '#000')
            }
            this.currentLine = null
          }
          break
      }
    },

    // 鼠标在画布上双击
    canvasMouseDblclick(e) {
      // console.log(e)
      switch (this.currentType) {
        case 'polyline':
          this.finishPolyline(e)
          break
        case 'polygon':
          this.finishPolygon(e)
          break
      }
    },

    // 鼠标滚轮在画布上的事件
    canvasMouseWheel(opt) {
      const delta = opt.e.deltaY // 滚轮，向上滚一下是 -100，向下滚一下是 100
      let zoom = this.canvas.getZoom() // 获取画布当前缩放值
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01
      this.canvas.zoomToPoint(
        {
          x: opt.e.offsetX,
          y: opt.e.offsetY
        },
        zoom
      )
      opt.e.preventDefault()
      opt.e.stopPropagation()
    },

    // 全局键盘事件 按下
    keyDown(e) {
      console.log(e.keyCode)
      if (e.keyCode === 32) {
        // 空格键
        this.spaceKeyState = true
        if (!this.canvas.isDragging) {
          // 在非拖拽时按下空格，鼠标指针是个手
          this.canvas.setCursor('grab')
        }
      }
    },

    // 全局键盘事件 抬起
    keyUp(e) {
      // console.log(e.keyCode)
      if (e.keyCode === 32) {
        // 空格键
        this.spaceKeyState = false
        if (!this.canvas.isDragging) {
          this.canvas.setCursor('default')
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.manager_detail {
  width: 100%;
  height: calc(100vh - 108px);
  overflow: hidden;

  .my-row {
    height: 100%;

    .operation-left,
    .operation-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: calc(100vh - 120px);

      .operation-item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 100px;
        height: 100px;
        padding: 10px;
        background: red;
        background: linear-gradient(145deg, #cacaca, #f0f0f0);
        border-radius: 10px;
        box-shadow: 15px 15px 30px #d5d5d5, -15px -15px 30px #ebebeb;

        .operation-img {
          width: 40px;
          height: 40px;
        }
      }

      .operation-item.active {
        background: #fff;
        box-shadow: 20px 20px 60px #d9d9d9, -20px -20px 60px #fff;
      }

      .operation-item.danger {
        background: #f56c6c;
        box-shadow: 20px 20px 60px #d05c5c, -20px -20px 60px #ff7c7c;
      }

      .operation-item.save {
        background: #409eff;
        box-shadow: 20px 20px 60px #3686d9, -20px -20px 60px #4ab6ff;
      }
    }
  }

  #canvas {
    box-sizing: border-box;
    border: 2px solid #0f0;
  }
}
</style>
