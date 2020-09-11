<template>
  <div id="app">
    <template v-if="!$route.meta.isPublic">
      <el-container>
        <el-header><Header /></el-header>
        <el-main style="padding: 0;"><router-view /></el-main>
      </el-container>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
  import Header from "@/views/layout/Header";
  export default {
    components: {
      Header
    }
  }

</script>

<style lang="scss">
html, body{
  margin: 0;
  height: 100%;
  width: 100%;
}
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #0088ff;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-container {
  height: 100%;
}
</style>
