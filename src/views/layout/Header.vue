<template>
  <div class="nav">
    <div class="title">Sibbay 互动创作平台</div>
    <el-input
        prefix-icon="el-icon-search"
        size="small"
        v-model="searchInput"
        class="search">
    </el-input>
    <el-menu
        :default-active="'0'"
        mode="horizontal"
        class="menu"
        @select="handlerSelectMenu"
        background-color="#0088ff"
        text-color="#f2f2f2"
        active-text-color="#f2f2f2">
      <el-submenu index="org" v-if="$store.state.organization.length > 0">
        <template slot="title">组织空间</template>
        <el-menu-item :index="org.id" v-for="org in $store.state.organization" :key="org.id">{{org.name}}</el-menu-item>
      </el-submenu>
      <el-menu-item index="user">个人空间</el-menu-item>
      <el-menu-item index="template">模板广场</el-menu-item>
    </el-menu>
    <div class="dropMenu">
      <el-dropdown @command="handlerNewCommand">
        <span style="cursor: pointer;"><i style="color: #f2f2f2" class="el-icon-circle-plus el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item of newCreateChoiceData" :key="item.name" :command="item.id">{{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <i class="el-icon-time"></i>
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
            <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599066548358&di=d20d79b417da211d54dc2fcf81814b8c&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn14%2F480%2Fw640h640%2F20181003%2Fbad0-hkvrhps2107172.jpg"
                alt="">
            <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--新建桶-->
    <el-dialog title="新建桶" :visible.sync="dialogNewBucketVisible" style="text-align: left">
      <el-form label-position="left" :rules="newBucketRules" ref="newBucketForm" label-width="80px" :model="newBucket">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newBucket.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属" prop="ownerType">
          <el-radio v-model="newBucket.ownerType" label="USER">个人</el-radio>
          <el-radio v-model="newBucket.ownerType" :disabled="$store.state.organization.length === 0" label="ORGANIZATION">组织
          </el-radio>
        </el-form-item>
        <el-form-item label="组织"
                      v-if="newBucket.ownerType === 'ORGANIZATION' && $store.state.organization">
          <el-select v-model="ownerId" placeholder="请选择">
            <el-option
                v-for="item in $store.state.organization"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerNewBucketCancel">取 消</el-button>
        <el-button type="primary" @click="handlerNewBucketSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--新建组织-->
    <el-dialog title="新建组织" :visible.sync="dialogNewOrganizationVisible" style="text-align: left">
      <el-form label-position="left" :rules="newOrganizationRules" ref="newOrganizationForm" label-width="80px" :model="newOrganization">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newOrganization.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerNewOrganizationCancel">取 消</el-button>
        <el-button type="primary" @click="handlerNewOrganizationSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--新建对话-->
    <el-dialog title="新建对话" :visible.sync="dialogNewDialogueVisible" style="text-align: left">
      <el-form label-position="left" :rules="newDialogueRules" ref="newDialogueForm" label-width="80px" :model="newDialogue">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newDialogue.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio v-model="newDialogue.type" label="DIALOGUE">对话</el-radio>
          <el-radio v-model="newDialogue.type" label="FOLDER">文件夹</el-radio>
        </el-form-item>
        <el-form-item label="目录" prop="folder">
          <el-tree
              :current-node-key="folderCurrentKey"
              :props="pathTreeProps"
              :load="pathTreeLoadNode"
              @node-click="handleParentPathChange"
              :highlight-current="true"
              :check-on-click-node="true"
              lazy>
          </el-tree>
        </el-form-item>
        <el-form-item label="归属" prop="ownerType">
          <el-radio v-model="newDialogue.ownerType" label="USER">个人</el-radio>
          <el-radio v-model="newDialogue.ownerType" :disabled="$store.state.organization.length === 0" label="ORGANIZATION">组织
          </el-radio>
        </el-form-item>
        <el-form-item label="组织"
                      v-if="newDialogue.ownerType === 'ORGANIZATION' && $store.state.organization">
          <el-select v-model="ownerId" placeholder="请选择">
            <el-option
                v-for="item in $store.state.organization"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
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
import {createBucket} from "@/api/graphql/bucket";
import {createOrganization} from "@/api/graphql/user";
import {createDialogue, getAllDialogue} from "@/api/graphql/dialogue";

export default {
  name: 'Header',
  data() {
    return {
      searchInput: '',
      navList: [
        {name: '组织空间'},
        {name: '个人空间'},
        {name: '模板广场'}
      ],
      folderCurrentKey: "",
      newCreateChoiceData: [
        {name: '互动', id: 'dialogue'}, {name: '桶', id: 'bucket'}, {name: '组织', id: 'organization'},
      ],
      newBucket: {
        name: "",
        ownerType: "USER",
      },
      newOrganization: {
        name: "",
      },
      newDialogue: {
        name: "",
        type: "DIALOGUE",
        parentPath: "root",
        ownerType: "USER",
      },
      ownerId: "",
      dialogNewBucketVisible: false,
      dialogNewDialogueVisible: false,
      dialogNewOrganizationVisible: false,
      pathTreeProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      newBucketRules: {
        name: [
          {required: true, message: '请输入桶名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 至 10 个字符', trigger: 'blur'},
        ],
        ownerType: [
          {required: true, message: '请选择所有者', trigger: 'change'}
        ]
      },
      newOrganizationRules: {
        name: [
          {required: true, message: '请输入组织名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在 2 至 10 个字符', trigger: 'blur'},
        ],
      },
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
    pathTreeLoadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '根目录', value: 'root' }]);
      }
      let nodes = []
      getAllDialogue({
        ownerType: this.newDialogue.ownerType,
        parentPath: node.data.value,
        ownerId: this.ownerId
      }).then(
          (resp) => {
            nodes = resp.data.getAllDialogues.filter(item => {
              return item.type === "FOLDER"
            }).map(item => {
              return {
                value: `${item.parentPath}/${item.name}`,
                name: item.name,
                leaf: false
              }
            })
            console.log(nodes)
          }
      ).catch(() => {

      }).finally(() => {
        resolve(nodes)
      })

    },
    handlerNewCommand(command) {
      switch (command) {
        case "dialogue":
          this.dialogNewDialogueVisible = true
          break
        case "bucket":
          this.dialogNewBucketVisible = true
          break
        case "organization":
          this.dialogNewOrganizationVisible = true
          break
      }
    },
    handlerNewBucketCancel() {
      this.newBucket = {
        name: "",
        ownerType: "USER",
      }
      this.ownerId = ""
      this.dialogNewBucketVisible = false
    },
    handlerNewBucketSubmit() {
      this.$refs.newBucketForm.validate((valid) => {
        if (valid) {
          createBucket({ownerId: this.ownerId, newBucket: this.newBucket}).then(() => {
            this.$message.success("桶创建成功")
          })
          this.handlerNewBucketCancel()
        } else {
          this.$message.error("信息填写出错")
        }
      })
    },
    handlerNewOrganizationCancel() {
      this.newOrganization = {
        name: "",
      }
      this.dialogNewOrganizationVisible = false
    },
    handlerNewOrganizationSubmit() {
      this.$refs.newOrganizationForm.validate((valid) => {
        if (valid) {
          createOrganization({newOrg: this.newOrganization}).then(() => {
            this.$message.success("组织创建成功")
          })
          this.handlerNewOrganizationCancel()
        } else {
          this.$message.error("信息填写出错")
        }
      })
    },
    handleParentPathChange(node) {
      console.log(node, this.folderCurrentKey)
      this.newDialogue.parentPath = node.value
      this.folderCurrentKey = node.value
    },
    handlerNewDialogueCancel() {
      this.newDialogue = {
        name: "",
        type: "DIALOGUE",
        parentPath: "root",
        ownerType: "USER",
      }
      this.folderCurrentKey = ""
      this.dialogNewDialogueVisible = false
    },
    handlerNewDialogueSubmit() {
      this.$refs.newDialogueForm.validate((valid) => {
        if (valid) {
          if (this.folderCurrentKey === '') {
            this.$message.error("请填写位置")
            return
          }
          createDialogue({ownerId: this.ownerId, newDialogue: this.newDialogue}).then((res) => {
            this.$message.success(`${this.newDialogue.type === "FOLDER" ? "文件夹" : "对话"}创建成功`)
            if (this.newDialogue.ownerType === 'USER') {
              this.$router.push({name: 'Creation', query: {_: +new Date(), org: this.ownerId, id: res.data.createDialogue.id}})
            } else {
              this.$router.push({name: 'Creation', query: {_: +new Date(), org: this.ownerId, id: res.data.createDialogue.id}})
            }
          })
          this.handlerNewDialogueCancel()
        } else {
          this.$message.error("信息填写出错")
        }
      })
    },
    handlerSelectMenu(key, keyPath) {
      console.log(key, keyPath)
      if (keyPath.indexOf('org') !== -1) {
        this.$router.push({name: 'Creation', query: {_: +new Date(), org: key}})
      }
      if (keyPath.indexOf('user') !== -1) {
        this.$router.push({name: 'Creation', query: {_: +new Date()}})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  height: 60px;
  line-height: 60px;
  display: flex;
  color: #f2f2f2;

  .title {
    margin-left: 30px;
    margin-right: 20px;
    width: 230px;
  }

  .search {
    width: 260px;
    margin-left: 20px
  }

  .menu {
    margin-left: 6%;
  }

  .dropMenu {
    display: flex;
    position: fixed;
    height: 30px;
    right: 60px;

    i {
      font-size: 20px;
      margin-top: 20px;
      margin-left: 20px;
    }

    .el-dropdown-link {
      margin-left: 20px;

      i {
        font-size: 18px;
        position: absolute;
        margin-left: 5px;
      }

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-top: 15px;
      }
    }
  }
}
</style>