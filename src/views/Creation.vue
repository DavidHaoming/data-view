<template>
  <el-row class="creation-main">
    <div class="left-aside">
      <left :owner-id="creationId" :owner-type="creationType"></left>
    </div>
    <mind-map-index v-if="dialogue.id !== ''" :id="dialogue.id" :init-dialogue-content="dialogue.content"></mind-map-index>
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
  watch: {
    $route(to) {
      this.initPage(to)
    }
  },
  data() {
    return {
      creationType: 'USER',
      creationId: '',
      id: '',
      dialogue: {
        id: '',
        createdAt: '',
        updatedAt: '',
        name: '',
        owner: '',
        ownerType: '',
        recentlyAuthor: '',
        type: '',
        parentPath: '',
        content: '',
        history: []
      }
    }
  },
  mounted() {
    this.initPage(this.$route)
  },
  methods: {
    initPage(r) {
      if (r.query.org) {
        this.creationType = 'ORGANIZATION'
        this.creationId = r.query.org
      } else {
        this.creationType = 'USER'
      }
      this.id = r.query.id || ''
      if (this.id !== '') {
        getOneDialogue({id: this.id}).then((res) => {
          this.dialogue = res.data.getOneDialogue
          console.log(this.dialogue)
        }).catch(() => {
          this.$message.error('获取对话出错')
        })
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