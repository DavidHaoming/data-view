<template>
  <div class="left-aside">
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
            lazy
            node-key="id"
            v-if="showExplorerTree"
            class="explorer-tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
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
      <el-form label-position="left" :rules="newDialogueRules" ref="newDialogueForm" label-width="80px" :model="newDialogue">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newDialogue.name" autocomplete="off"></el-input>
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
  </div>

</template>

<script>
import {createDialogue, getAllDialogue} from "@/api/graphql/dialogue";

export default {
  name: "Left",
  props: {
    ownerId: String,
    ownerType: String
  },
  watch: {
    $route(to, from) {
      if (to.query.org === from.query.org) return
      this.resetExplorer()
    }
  },
  data() {
    return {
      dialogNewDialogueVisible: false,
      newDialogue: {
        name: "",
        type: "DIALOGUE",
        parentPath: "root",
        ownerType: this.ownerType,
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
    resetExplorer() {
      this.showExplorerTree = false
      this.$refs.explorerTree.$nextTick(() => {
        this.showExplorerTree = true
      })
    },
    handlerNewDialogueCancel() {
      this.newDialogue = {
        name: "",
        type: "DIALOGUE",
        parentPath: "root",
        ownerType: this.ownerType,
      }
      this.dialogNewDialogueVisible = false
    },
    handlerNewDialogueSubmit() {
      this.$refs.newDialogueForm.validate((valid) => {
        if (valid) {
          createDialogue({ownerId: this.ownerId, newDialogue: this.newDialogue}).then((res) => {
            console.log(this.newDialogue.type)
            this.$message.success(`${this.newDialogue.type === "FOLDER" ? "文件夹" : "对话"}创建成功`)
            this.resetExplorer()
            if (this.newDialogue.type === "FOLDER") return
            if (this.newDialogue.ownerType === 'USER') {
              this.$router.push({name: 'Creation', query: {_: +new Date(), id: res.data.createDialogue.id}})
            } else {
              this.$router.push({name: 'Creation', query: {_: +new Date(), org: this.ownerId, id: res.data.createDialogue.id}})
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
    },
    handleExplorerChange(node) {
      console.log(node)
      if (node.leaf === true) {
        let query = Object.assign({}, this.$route.query, {_: +new Date()})
        query.id = node.id
        console.log(query)
        this.$router.push({name: 'Creation', query: query})
      }
    },
    explorerTreeLoadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '根目录', value: 'root' }]);
      }
      let nodes = []
      getAllDialogue({
        ownerType: this.ownerType,
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

      }).finally(() => {
        resolve(nodes)
      })

    },
  }
}
</script>

<style scoped>
.left-aside {
  display: flex;
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

</style>