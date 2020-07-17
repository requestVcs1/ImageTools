<template>
  <div id="app">
    <div class="boxx">
      <div class="boxxx">
        <div class="box">
          <zoomImgVue />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import zoomImgVue from './components/zoomImg.vue'
export default {
  name: 'App',
  components: {
    zoomImgVue,
  },
}
</script>

<style lang="scss">
html {
  width: 100vw;
  height: 100vh;
  margin: 0;
}
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
.boxx {
  position: absolute;
  left: 40px;
  top: 30;
  width: 100%;
  height: 100%;
  .boxxx {
    position: relative;
    left: 20px;
    top: 25px;
    width: 100%;
    height: 100%;
  }
}
.box {
  width: 1000px;
  height: 1000px;
  border: 1px solid slategrey;
  // margin: 50px;
}
</style>
