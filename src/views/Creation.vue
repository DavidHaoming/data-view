<template>
  <el-row class="creation-main">
    <div :class="isHide === false ? 'left-asides' : ' left-aside'">
      <left :hideData="hideData" @onceData="onceData"></left>
    </div>
    <mind-map-index @hideMenu="hideMenu"></mind-map-index>
  </el-row>
</template>

<script>
import Left from "@/views/aside/Left";
import MindMapIndex from "@/views/mindmap/Index";
import {getOneDialogue} from "@/api/graphql/dialogue";

export default {
  name: "Creation",
  props: {
    once: {
      type: Boolean,
      default: null
    }
  },
  components: {
    Left,
    MindMapIndex
  },
  data() {
    return {
      hideData: 0,
      isHide: true
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
    },
    // 接收编辑区传递过来的隐藏
    hideMenu(data) {
      this.hideData = data
      this.isHide = false
    },
    onceData(data) {
      this.isHide = data
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
  /*flex: 0 0 300px;*/
  height: 100%;
  width: 300px;
  transition-property: width;
  transition-duration: 1s;
}
.left-asides {
  height: 100%;
  width: 50px;
  transition-property: width;
  transition-duration: 1s;
}
</style>