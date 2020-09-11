<template>
  <div class="left-aside">
    <div class="sidebar collapsed-menu">
      <div :class="'sidebar-button ' + (activeSidebarButton === 'step' ? 'selected' : '')">
        <el-button type="text" @click="handleSidebarButton('step')">
          <i class="el-icon-s-operation sidebar-icon"></i></el-button>
      </div>
      <div :class="'sidebar-button ' + (activeSidebarButton === 'explorer' ? 'selected' : '')">
        <el-button type="text" @click="handleSidebarButton('explorer')">
          <i class="el-icon-folder-opened sidebar-icon"></i></el-button>
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
            :data="data"
            show-checkbox
            node-key="id"
            class="explorer-tree"
            default-expand-all
            :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
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
export default {
  name: "Left",
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      activeSidebarButton: 'step',
      activeStep: '1',
      stepData: [
        {title: '步骤一', context: '<div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div><div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>'},
        {title: '步骤二', context: '<div>简化流程：设计简洁直观的操作流程；</div>'},
        {title: '步骤三', context: '<div>简化流程：设计简洁直观的操作流程；</div>'},
      ],
      data: JSON.parse(JSON.stringify(data)),
      explorerSearch: ''
    }
  },
  methods: {
    append() {

    },
    remove() {

    },
    handleSidebarButton(index) {
      this.activeSidebarButton = index
    }
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