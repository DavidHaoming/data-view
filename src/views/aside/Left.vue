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
              @click="() => append(data)">
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
  </div>

</template>

<script>
import {getAllDialogue} from "@/api/graphql/dialogue";

export default {
  name: "Left",
  props: {
    ownerId: String,
    ownerType: String
  },
  watch: {
    $route(to, from) {
      if (to.query.org === from.query.org) return
      this.showExplorerTree = false
      this.$refs.explorerTree.$nextTick(() => {
        this.showExplorerTree = true
      })
    }
  },
  data() {
    return {
      activeSidebarButton: 'explorer',
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
      showExplorerTree: true
    }
  },
  methods: {
    append() {

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