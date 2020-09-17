<template>
  <el-row class="creation-main">
    <div class="left-aside">
      <left></left>
    </div>
    <mind-map-index></mind-map-index>
  </el-row>
</template>

<script>
import Left from "@/views/aside/Left";
import MindMapIndex from "@/views/mindmap/Index";

export default {
  name: "Creation",
  components: {
    Left,
    MindMapIndex
  }
}
</script>

<style scoped>
.creation-main {
  height: 100%;
  width: 100%;
  display: flex;
}

.left-aside {
  flex: 0 0 300px;;
  height: 100%;
}
</style>