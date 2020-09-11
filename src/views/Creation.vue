<template>
  <el-row class="creation-main">

    <div class="left-aside">
      <left></left>
    </div>
    <div class="center-main">
      <mind-map-index></mind-map-index>
    </div>
    <div class="right-aside">
      <right></right>
    </div>

  </el-row>
</template>

<script>
import Left from "@/views/aside/Left";
import Right from "@/views/aside/Right";
import MindMapIndex from "@/views/mindmap/Index";

export default {
  name: "Creation",
  components: {
    Left,
    Right,
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
  /*width: 300px;*/
}

.center-main {
  flex: 1;
  width: calc(100% - 600px);
}

.right-aside {
  flex: 0 0 300px;
}
</style>