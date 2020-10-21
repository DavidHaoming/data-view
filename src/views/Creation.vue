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
import {getOneDialogue} from "@/api/graphql/dialogue";

export default {
  name: "Creation",
  components: {
    Left,
    MindMapIndex
  },
  data() {
    return {
    }
  },
  mounted() {
    // this.initPage(this.$route)
  },
  methods: {
    initPage(r) {
      this.id = r.query.id || ''
      if (this.id !== '') {
        getOneDialogue({id: this.id}).then((res) => {
          this.dialogue = res.data.getOneDialogue
          console.log(this.dialogue)
        }).catch(() => {
          this.$message.error('获取对话出错')
        })
      } else {
        this.$message.info('请新建/打开一个对话')
      }
    }
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