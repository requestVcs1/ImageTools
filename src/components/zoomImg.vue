<template>
  <div
    class="img-zoom-com"
    @mousewheel="mousewheelImgHandler"
    ref="imgZoomComRef"
    :class="{zoom_cursor:is_zoom_tool}"
  >
    <!-- 右上角倍数窗口 -->
    <div class="zoom-info">
      <div class="zoom-control">
        <span class="zoom-minus" @click="zoomScaleMinus">-</span>
        <span class="zoom-value">{{ zoom_scale }}</span>
        <span class="zoom-add" @click="zoomScaleAdd">+</span>
      </div>
      <!-- 全屏按钮 -->
      <div class="full-screen">
        全
      </div>
    </div>
    <!-- 主图展示区域 -->
    <div
      @mousedown="mousedownWrapHandler"
      @mousemove="mousemoveWrapHandler"
      @mouseleave="mouseleaveWrapHandler"
      @mouseenter="mouseenterWrapHandler"
      class="img-wrap mid"
      ref="ImgWrapRef"
    >
      <img @load="loadImage" src="../assets/dongtian.jpg" alt="" />
    </div>
    <!-- 放大镜盒子 -->
    <div
      v-show="is_zoom_tool && !is_mouseout"
      class="zoom-tool-box"
      ref="zoomToolBoxRef"
      :style="{transform: `translate(${this.mousePosInfo.offsetX},${this.mousePosInfo.offsetY})`}"
    >
      <img ref="zoomImgRef" src="../assets/dongtian.jpg" alt="" />
    </div>
  </div>
</template>

<script>
import computedOffset from '../plugins/computedOffset'
export default {
  data() {
    return {
      zoom_scale: 100, // 放大
      scale_val: 1, //比例
      is_rectangular: false,
      is_zoom_tool: false,
      is_move: false,
      is_mouseout: true,
      mousePosInfo: {
        startX: 0,
        startY: 0,
        isMoveFlag: false,
        offsetX: 0,
        offsetY: 0
      },
    }
  },
  mounted() {
    window.addEventListener('keydown', this.keydownWindowHandler)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('keydown', this.keydownWindowHandler)
    })
    window.addEventListener('keyup', this.keyupWindowHandler)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('keyup', this.keyupWindowHandler)
    })
    const ImgWrapRef = this.getRef('ImgWrapRef')
    this.mousePosInfo = Object.assign(
      {},
      this.mousePosInfo,
      computedOffset(ImgWrapRef, false)
    )
  },
  methods: {
    // 获取DOM
    getRef(name) {
      return this.$refs[name]
    },
    // 外层盒子鼠标按下事件处理
    mousedownWrapHandler(e) {
      e.preventDefault()
      this.is_move = true
      // const scale_val = ImgWrapRef.offsetWidth / (this.zoom_scale / 100 * ImgWrapRef.offsetWidth) // 计算比例
      this.mousePosInfo.startX = e.clientX - this.mousePosInfo.offsetX
      this.mousePosInfo.startY = e.clientY - this.mousePosInfo.offsetY
      window.addEventListener('mouseup', this.windowWrapHandler)
    },
    // 外层盒子鼠标移动事件处理
    mousemoveWrapHandler(e) {
      const moveY = e.clientY
      const moveX = e.clientX
      const { startX, startY, offsetLeft,offsetTop ,offsetX, offsetY  } = this.mousePosInfo
      const ImgWrapRef = this.getRef('ImgWrapRef')
      if(this.is_move) {
        const x = moveX - startX
        const y = moveY - startY
        this.mousePosInfo.offsetX = x
        this.mousePosInfo.offsetY = y
        ImgWrapRef.style.transform = `translate(${x}px, ${y}px) scale(${this.zoom_scale / 100})`;
      }
      const zoomToolBoxRef = this.getRef('zoomToolBoxRef')
      /* 
       75为放大镜盒子半径 
      */
     console.log(offsetX,offsetY)
      const zoomImgRef = this.getRef('zoomImgRef')
      const scale_val = 2000 / (this.zoom_scale / 100 * ImgWrapRef.offsetWidth) // 计算比例
      zoomToolBoxRef.style.transform = `translate(${moveX - offsetLeft - 75}px, ${moveY - offsetTop - 75}px)`
      const x = (e.clientX - offsetX - offsetLeft) * 2 - 75
      const y = (e.clientY - offsetY - offsetTop) * 2 - 75
      const styleStr =  zoomImgRef.style.cssText + `left:-${x}px;top:-${y}px;`
     zoomImgRef.style = styleStr
    },
    // 外层盒子鼠标弹起事件处理
    windowWrapHandler(e) {
      this.is_move = false
      window.removeEventListener('mouseup', this.windowWrapHandler)
    },
    // window keydown事件处理
    keydownWindowHandler(e) {
      switch (e.keyCode) {
        case 16:
          if (!this.is_zoom_tool) {
            this.is_zoom_tool = true
          }
          break
      }
    },
    // window keyup事件处理
    keyupWindowHandler(e) {
      switch (e.keyCode) {
        case 16:
            this.is_zoom_tool = false
          break
      }
    },
    // 点击缩小
    zoomScaleAdd() {
      let num = this.zoom_scale
      if (this.zoom_scale >= 100)
        this.zoom_scale = parseInt(this.zoom_scale / 100) * 100 + 100
      else if (this.zoom_scale < 100) {
        if (this.zoom_scale >= 25 && this.zoom_scale < 50) {
          this.zoom_scale = 50
        } else this.zoom_scale = 100
      }
      this.zoom_scale = this.zoom_scale >= 400 ? 400 : this.zoom_scale
    },
    // 点击放大
    zoomScaleMinus() {
      let num = this.zoom_scale
      if (num > 100) num = parseInt(num / 100) * 100 - 100
      else {
        if (num > 25 && num <= 50) {
          num = 25
        } else if (num > 50 && num <= 100) num = 50
      }
      this.zoom_scale = num < 25 ? 25 : num
    },
    // originImg滚轮事件处理
    mousewheelImgHandler(e) {
      if (e.wheelDelta > 0) {
        let num = this.zoom_scale
        if (num >= 100) num = parseInt(num / 100) * 100 + 100
        else if (num < 100) {
          if (num >= 25 && num < 50) {
            num = 50
          } else num = 100
        }
        this.zoom_scale = num >= 400 ? 400 : num
      } else {
        let num = this.zoom_scale
        if (num > 100) num = parseInt(num / 100) * 100 - 100
        else {
          if (num > 25 && num <= 50) {
            num = 25
          } else if (num > 50 && num <= 100) num = 50
        }
        this.zoom_scale = num < 25 ? 25 : num
      }
    },
    // 移除图片
    mouseleaveWrapHandler() {
      this.is_zoom_tool = false
      this.is_mouseout = true
    },
    // 移入图片
    mouseenterWrapHandler() {
      this.is_mouseout = false
    },
    // 图片加载完毕
    loadImage(e) {
      this.$refs.zoomImgRef.style.width = e.target.offsetWidth * 2 + 'px'
    }
  },
  watch: {
    // 观察放大比例Val改变则修改对应DOM尺寸
    zoom_scale: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          const ImgWrapRef =  this.getRef('ImgWrapRef')
          ImgWrapRef.style.transform = `translate(${this.mousePosInfo.offsetX}px, ${this.mousePosInfo.offsetY}px) scale(${this.zoom_scale / 100})`;
        }
      },
    },
  }
}
</script>

<style lang="scss" scoped>
.img-zoom-com {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  &.zoom_cursor{
    cursor: crosshair;
  }
  .img-wrap {
    width: 100%;
    > img {
      width: 100%;
    }
  }
  .zoom-info {
    position: absolute;
    top: 0;
    right: 0;
    width: 210px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 6px;
    z-index: 10;
    user-select: none;
    .zoom-control {
      width: 130px;
      height: 35px;
      display: flex;
      border: 1px solid #fff;
      border-radius: 4px;
      align-items: center;
    }
    .zoom-add,
    .zoom-minus {
      width: 34px;
      text-align: center;
      font-size: 25px;
      border-right: 1px solid #474855;
      cursor: pointer;
    }
    .zoom-add {
      border-left: 1px solid #fff;
    }
    .zoom-minus {
      border-right: 1px solid #fff;
    }
    .zoom-value {
      flex: 1;
      font-size: 14px;
      text-align: center;
    }
  }
  .zoom-tool-box {
    overflow: hidden;
    pointer-events:none;
    width: 150px;
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.5);
    > img{
      position: absolute;
      left: -100px;
      top: -100px;
    }
  }
}
</style>
