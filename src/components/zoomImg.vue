<template>
  <div
    class="img-zoom-com"
    @mousewheel="mousewheelImgHandler"
    ref="imgZoomComRef"
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
      @mouseup="mouseupWrapHandler"
      class="img-wrap mid"
      ref="ImgWrapRef"
    >
      <img src="../assets/dongtian.jpg" alt="" />
      <!-- 放大镜盒子 -->
      <div
        v-show="is_zoom_tool"
        class="zoom-tool-box"
        ref="zoomToolBoxRef"
      ></div>
    </div>
  </div>
</template>

<script>
import computedOffset from '../plugins/computedOffset'
export default {
  data() {
    return {
      zoom_scale: 100,
      is_rectangular: false,
      is_zoom_tool: false,
      mousePosInfo: {
        startX: 0,
        startY: 0,
        isMoveFlag: true,
      },
    }
  },
  mounted() {
    window.addEventListener('keydown', this.keydownWindowHandler)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('keydown', this.keydownWindowHandler)
    })
  },
  methods: {
    // 获取DOM
    getRef(name) {
      return this.$refs[name]
    },
    // 外层盒子鼠标按下事件处理
    mousedownWrapHandler(e) {
      e.preventDefault()
      const startX = e.offsetX // 鼠标按下 X 点
      const startY = e.offsetY // 鼠标按下 Y 点
      this.mousePosInfo.startX = startX
      this.mousePosInfo.startY = startY
      const Com_Wrap = this.getRef('Com_Wrap')
      this.mousePosInfo = Object.assign(
        {},
        this.mousePosInfo,
        computedOffset(Com_Wrap, true)
      )
      window.addEventListener('mousemove', this.mousemoveWindowHandler)
    },
    // window鼠标移动事件处理
    mousemoveWindowHandler(e) {
      const moveX = e.pageX
      const moveY = e.pageY
      const { offsetLeft, offsetTop, startX, startY } = this.mousePosInfo
      const ImgWrapRef = this.getRef('ImgWrapRef')
      let strStyle = ImgWrapRef.style.cssText
      strStyle += `
            position:absolute;
            left:${moveX - offsetLeft - startX + ImgWrapRef.offsetWidth / 2}px;
            top:${moveY - offsetTop - startY + ImgWrapRef.offsetHeight / 2}px;
            `
      ImgWrapRef.style = strStyle
    },
    // 外层盒子鼠标弹起事件处理
    mouseupWrapHandler(e) {
      window.removeEventListener('mousemove', this.mousemoveWindowHandler)
    },
    // window键盘事件处理
    keydownWindowHandler(e) {
      switch (e.keyCode) {
        case 16:
          console.log('按下shift')
          break

        default:
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
  },
  watch: {
    // 观察放大比例Val改变则修改对应DOM尺寸
    zoom_scale: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          let strStyle = this.getRef('ImgWrapRef').style.cssText
          strStyle += `width:${newVal}%`
          this.getRef('ImgWrapRef').style = strStyle
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.img-zoom-com {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .img-wrap {
    width: 100%;
    position: relative;
    left: 50%;
    top: 50%;
    > img {
      width: 100%;
    }
    &.mid {
      transform: translate(-50%, -50%);
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
    width: 150px;
    height: 150px;
    background: steelblue;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.5);
  }
}
</style>
