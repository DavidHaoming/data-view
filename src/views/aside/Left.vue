<template>
  <div class="main">
    <div :class="hidePlay === false ? 'left-asides' : 'left-aside'">
      <div class="sidebar collapsed-menu">
        <div :class="'sidebar-button ' + (activeSidebarButton === 'explorer' ? 'selected' : '')">
          <el-button type="text" @click="handleSidebarButton('explorer')">
            <i class="el-icon-folder-opened sidebar-icon"></i></el-button>
        </div>

        <div :class="'sidebar-button ' + (activeSidebarButton === 'step' ? 'selected' : '')">
          <el-button type="text" @click="handleSidebarButton('step')">
            <i class="el-icon-s-operation sidebar-icon"></i></el-button>
        </div>
      </div>
      <div class="left-menu">
        <div v-if="hidePlay">
          <div v-if="activeSidebarButton === 'step'">
            <el-collapse v-model="activeStep" class="step-menu" accordion>
              <el-collapse-item style="text-align: unset" v-for="(item, index) of stepData" :key="index" :name="index"
                                :title="item.title">
                <div v-html="item.context"></div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-if="activeSidebarButton === 'explorer'">
            <el-input
                placeholder="输入关键字进行过滤"
                size="small"
                class="explorer-search"
                v-model="explorerSearch">
            </el-input>
            <el-tree
                @node-click="handleExplorerChange"
                ref="explorerTree"
                :props="explorerTreeProps"
                :load="explorerTreeLoadNode"
                :check-on-click-node="true"
                :highlight-current="true"
                :default-checked-keys="explorerCurrentKey"
                :default-expanded-keys="expandedList"
                :data="explorerData"
                lazy
                node-key="id"
                v-if="showExplorerTree"
                class="explorer-tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i class="iconfont icon-wenjianjia" v-if="!data.leaf"></i>
          <i class="iconfont icon-wenjian" v-if="data.leaf"></i>
          {{ data.name }}
        </span>
        <span>
          <el-button
              type="text"
              size="mini"
              @click="() => append(data)" v-if="!data.leaf">
            <i class="el-icon-circle-plus-outline"></i>
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
            <i class="el-icon-delete"></i>
          </el-button>
        </span>
      </span>
            </el-tree>
          </div>
        </div>
        <el-dialog :title="`新建对话 位置: ${newDialogue.parentPath}`" :visible.sync="dialogNewDialogueVisible" style="text-align: left">
          <el-form @submit.native.prevent label-position="left" :rules="newDialogueRules" ref="newDialogueForm" label-width="80px" :model="newDialogue">
            <el-form-item label="名称" prop="name">
              <el-input @keyup.enter.native="handlerEnterNewDialogueForm" v-model="newDialogue.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="newDialogue.type">
                <el-radio label="DIALOGUE">对话</el-radio>
                <el-radio label="FOLDER">文件夹</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handlerNewDialogueCancel">取 消</el-button>
            <el-button type="primary" @click="handlerNewDialogueSubmit">确 定</el-button>
          </div>
        </el-dialog>
        <div class="bottomTitle" v-if="hidePlay">Sibbay 互动创作平台</div>
      </div>
    </div>
    <div :class="hidePlay === false ? 'leftImgs' :  'leftImg' " >
      <el-image  :src="leftImg"  @click="hideMenu" style="cursor: pointer"></el-image>
    </div>
  </div>

</template>

<script>
import {createDialogue, getAllDialogue} from "@/api/graphql/dialogue";

export default {
  name: "Left",
  watch: {
    $route(to, from) {
      this.handlerSetOwnerInfo(to)
      if (to.params.type === from.params.type) return
      this.resetExplorer()
    },
  },
  mounted() {
    this.handlerSetOwnerInfo(this.$route)
  },
  data() {
    return {
      hidePlay: true,
      expandedList:[],
      leftImg:require('@/assets/img/leftZoom.png'),
      ownerId: '',
      dialogNewDialogueVisible: false,
      newDialogue: {
        name: "",
        type: "DIALOGUE",
        parentPath: "root",
        ownerType: "",
      },
      activeSidebarButton: 'explorer',
      nowDialoguePath: 'root',
      activeStep: '1',
      stepData: [
        {title: '步骤一', context: '<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div><div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>'},
        {title: '步骤二', context: '<div>简化流程：设计简洁直观的操作流程；</div>'},
        {title: '步骤三', context: '<div>简化流程：设计简洁直观的操作流程；</div>'},
      ],
      explorerTreeProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      explorerCurrentKey: [],
      explorerData: [],
      explorerSearch: '',
      showExplorerTree: true,
      newDialogueRules: {
        name: [
          {required: true, message: '请输入对话名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 至 10 个字符', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        folder: [
          {message: '请选择位置', trigger: 'blur'}
        ],
        ownerType: [
          {required: true, message: '请选择所有者', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    handlerSetOwnerInfo(r=this.$route) {
      if (r.params.type === 'organization') this.newDialogue.ownerType = 'ORGANIZATION'
      else if (r.params.type === 'user') this.newDialogue.ownerType = 'USER'
      else console.error(`params type error ${r.params.type}`)
      this.ownerId = r.params.id || ''
    },
    resetExplorer() {
      if (this.$refs.explorerTree) {
        this.showExplorerTree = false
        this.$refs.explorerTree.$nextTick(() => {
          this.showExplorerTree = true
        })
      }
    },
    handlerNewDialogueCancel() {
      this.newDialogue = {
        name: "",
        type: "DIALOGUE",
        parentPath: "root",
        ownerType: this.newDialogue.ownerType,
      }
      this.dialogNewDialogueVisible = false
    },
    handlerNewDialogueSubmit() {
      this.$refs.newDialogueForm.validate((valid) => {
        if (valid) {
          this.handlerSetOwnerInfo()
          createDialogue({ownerId: this.ownerId, newDialogue: this.newDialogue}).then((res) => {
            this.$message.success(`${this.newDialogue.type === "FOLDER" ? "文件夹" : "对话"}创建成功`)
            console.log(this.explorerData)
            this.resetExplorer()
            if (this.newDialogue.type === "FOLDER") return
            if (this.newDialogue.ownerType === 'USER') {
              this.$router.push({
                name: 'Creation',
                query: {id: res.data.createDialogue.id, _: +new Date()},
                params: {type: 'user'}
              })
            } else {
              this.$router.push({
                name: 'Creation',
                query: {id: res.data.createDialogue.id, _: +new Date()},
                params: {type: 'organization', id: this.ownerId}
              })
            }
          }).finally(() => {
            this.handlerNewDialogueCancel()
          })
        } else {
          this.$message.error("信息填写出错")
        }
      })
    },
    append(data) {
      console.log(data)
      this.newDialogue.parentPath = data.value
      this.dialogNewDialogueVisible = true
    },
    remove() {

    },
    handleSidebarButton(index) {
      this.activeSidebarButton = index
      this.hidePlay = true
    },
    handleExplorerChange(node) {
      if (node.leaf === true) {
        this.expandedList.push(node.id)
        let query = Object.assign({}, this.$route.query)
        query.id = node.id
        query._ = +new Date()
        console.log(query)
        this.$router.push({name: 'Creation', query: query, params: this.$route.params})
      }
    },
    handlerEnterNewDialogueForm(e) {
      console.log(e)
      e.preventDefault()
      this.handlerNewDialogueSubmit()
    },
    explorerTreeLoadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '根目录', value: 'root' }]);
      }
      let nodes = []
      if (node.data.leaf) {
        resolve(nodes)
        return
      }
      getAllDialogue({
        ownerType: this.newDialogue.ownerType,
        parentPath: node.data.value,
        ownerId: this.ownerId
      }).then(
          (resp) => {
            nodes = resp.data.getAllDialogues.map(item => {
              return {
                value: `${item.parentPath}/${item.name}`,
                name: item.name,
                leaf: item.type !== "FOLDER",
                id: item.id
              }
            })
            console.log(nodes)
          }
      ).catch(() => {
        if (!node.data.leaf) this.$message.info('目录/文件为空, 请新建!')
      }).finally(() => {
        resolve(nodes)
      })
    },
    // 隐藏菜单栏
    hideMenu() {
      this.hidePlay = false
    }
  }
}
</script>

<style scoped>
.left-aside {
  display: flex;
  width: 300px;
  height: 100%;
  transition-property: width;
  transition-duration: 1s;
  transition:all 0.2s ease-in-out 0.2s
}
.left-asides {
  height: 100%;
  display: flex;
  width: 45px;
  transition-property: width;
  /*transition-duration: ;*/
  transition:all 0.2s ease-in 0.2s
}
.bottomTitle{
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
}
.collapsed-menu {
  flex: 0 0 44px;
  width: 44px;
  height: 100%;
}

.sidebar {
  background: #0088ff;
}

.sidebar-icon {
  color: #f2f3f8;
  font-size: 20px;
}

.sidebar-button:hover {
  background: #006DCC;
}

.selected {
  background: #006DCC;
}

.left-menu {
  flex: 1;
  background: #F8F8FA;
  position: relative;
}

.step-menu {
  margin-left: 10px;
  background: #F8F8FA;
  text-align: left;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.custom-tree-node i {
  color: #0088FF;
}

.explorer-search {
  background: #F8F8FA;
  margin-top: 20px;
  margin-left: auto;
  width: 220px;
}

.explorer-tree {
  background: #F8F8FA;
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
}
.main {
  display: flex;
  position: relative;
  height: 100%;
  background-color: #f6f6f6;
}
.leftImg{
  /*background-color: #f6f6f6;*/
  position: absolute;
  left: 300px;
  z-index: 99;
  width: 30px;
  align-self:center;
  transition-property: width;
  /*transition-duration: ;*/
  transition:all 0.2s ease-in 0.1s
}
.leftImgs{
  /*background-color: #f6f6f6;*/
  position: absolute;
  left: 300px;
  z-index: 99;
  width: 0;
  align-self:center;
}
</style>