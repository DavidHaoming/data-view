<template>
  <div class="nav">
<!--    <div class="title">Sibbay 互动创作平台</div>-->
    <div class="title">
     <el-menu 
         :default-active="activeIndex"
         class="el-menu-demo"
         background-color="#0088ff"
         text-color="#ffffff"
         mode="horizontal"
         active-text-color="#ffffff"
         @select="handlerSelectMenu">
       <el-submenu index="2">
         <template slot="title">{{activeIndex}}</template>
         <template v-if="$store.state.organization.length > 0">
         <el-menu-item :index='"{" + `"id"` + ":"+  `"${org.id}"` + "," + `"name"` + ":" + `"${org.name}"` + "}"' v-for="org in $store.state.organization" :key="org.id">{{org.name}}</el-menu-item>
         </template>
         <el-menu-item index="个人空间">个人空间</el-menu-item>
         <el-menu-item v-for="item of newCreateChoiceData" :key="item.name" :index="item.name" @click="handlerNewCommand(item.id)" >新增{{item.name}}</el-menu-item>
       </el-submenu>
     </el-menu>
    </div>
    <el-input
        prefix-icon="el-icon-search"
        size="small"
        v-model="searchInput"
        class="search">
    </el-input>
    <div class="dropMenu">
<!--      <el-dropdown @command="handlerNewCommand">-->
<!--        <span style="cursor: pointer;"><i style="color: #f2f2f2" class="el-icon-circle-plus el-icon&#45;&#45;right"></i></span>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item v-for="item of newCreateChoiceData" :key="item.name" :command="item.id">{{ item.name }}-->
<!--          </el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
<!--      <i class="el-icon-time"></i>-->
<!--      <el-dropdown :hide-on-click="false" trigger="click">-->
        <span class="el-dropdown-link">
            <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599066548358&di=d20d79b417da211d54dc2fcf81814b8c&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn14%2F480%2Fw640h640%2F20181003%2Fbad0-hkvrhps2107172.jpg"
                alt="">
<!--            <i class="el-icon-caret-bottom"></i>-->
        </span>
       <div class="share">
         <span style="border-right: 1px dashed #cecdcd; opacity: 0.8">协作</span>
         <span style="opacity: 0.8">分享</span>
       </div>
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item>个人信息</el-dropdown-item>-->
<!--          <el-dropdown-item>退出登录</el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
    </div>

    <!--新建桶-->
    <el-dialog title="新建桶" :visible.sync="dialogNewBucketVisible" style="text-align: left">
      <el-form @submit.native.prevent label-position="left" :rules="newBucketRules" ref="newBucketForm" label-width="80px" :model="newBucket">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newBucket.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="归属" prop="ownerType">
          <el-radio-group v-model="newBucket.ownerType">
            <el-radio label="USER">个人</el-radio>
            <el-radio :disabled="$store.state.organization.length === 0" label="ORGANIZATION">组织</el-radio>
          </el-radio-group>
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
      <el-form @submit.native.prevent label-position="left" :rules="newOrganizationRules" ref="newOrganizationForm" label-width="80px" :model="newOrganization">
        <el-form-item label="名称" prop="name">
          <el-input @keyup.enter.native="handlerNewOrganizationSubmit" v-model="newOrganization.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerNewOrganizationCancel">取 消</el-button>
        <el-button type="primary" @click="handlerNewOrganizationSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!--新建对话-->
    <el-dialog title="新建对话" :visible.sync="dialogNewDialogueVisible" style="text-align: left">
      <el-form @submit.native.prevent label-position="left" :rules="newDialogueRules" ref="newDialogueForm" label-width="80px" :model="newDialogue">
        <el-form-item label="名称" prop="name">
          <el-input v-model="newDialogue.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="newDialogue.type">
            <el-radio label="DIALOGUE">对话</el-radio>
            <el-radio label="FOLDER">文件夹</el-radio>
          </el-radio-group>
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
          <el-radio-group v-model="newDialogue.ownerType">
            <el-radio label="USER">个人</el-radio>
            <el-radio :disabled="$store.state.organization.length === 0" label="ORGANIZATION">组织</el-radio>
          </el-radio-group>
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
  watch: {
    $route(to) {
      if (to.params.type === 'organization' && to.params.id) this.defaultActiveMenu = to.params.id
      if (to.params.type === 'user') this.defaultActiveMenu = 'user'
    }
  },
  data() {
    return {
      defaultActiveMenu: '',
      activeIndex: '个人空间',
      searchInput: '',
      folderCurrentKey: "",
      newCreateChoiceData: [
        // {name: '互动', id: 'dialogue'}, {name: '桶', id: 'bucket'}, {name: '组织', id: 'organization'},
        {name: '桶', id: 'bucket'},
        {name: '组织', id: 'organization'},
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
          }).finally(() => {
            this.handlerNewBucketCancel()
          })
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
          }).finally(() => {
            this.handlerNewOrganizationCancel()
          })
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
    handlerSelectMenu(key, keyPath) {
      console.log(key)
      // const a = '{"id":"5f928554b315e5bdfc23c26e","name":"vvv"}'
      // console.log(JSON.parse(key))
      if (key.indexOf('{') !== -1 ) {
        let keyValue = JSON.parse(key)
        this.activeIndex = keyValue.name
        this.$router.push({
          name: 'Creation',
          query: {_: +new Date()},
          params: {type: 'organization', id: keyValue.id}
        })
      } else {
        this.activeIndex = key
        if (keyPath.indexOf('个人空间') !== -1) {
          this.$router.push({
            name: 'Creation', query: {_: +new Date()}, params: {type: 'user'}
          })
        }
      }
      // if (keyPath.indexOf('zzz') !== -1) {
      //   this.$router.push({
      //     name: 'Creation',
      //     query: {_: +new Date()},
      //     params: {type: 'organization', id: key}
      //   })
      // }
      // if (keyPath.indexOf('个人空间') !== -1) {
      //   this.$router.push({
      //     name: 'Creation', query: {_: +new Date()}, params: {type: 'user'}
      //   })
      // }
    },
    handleSelect(key,keyPath) {
      console.log('key', key)
      this.activeIndex = key
      console.log('keyPath', keyPath)
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
    text-align: center;
    width: 200px;
    right: 100px;
    cursor: pointer;
    i {
      font-size: 20px;
      margin-top: 20px;
      margin-left: 20px;
    }
    .el-dropdown{
      display: inline-block;
      position: relative;
      color: #606266;
      height: 60px;
      font-size: 14px;
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
::v-deep .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
  color: white;
}
::v-deep .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  border-bottom: none;
}
::v-deep.el-popper{
  transform-origin: center top;
  z-index: 2006;
  position: fixed;
  top: 45px;
  left: 1614px;
}
.share{
  margin-left: 20px;
  background-color: #ffffff;
  width: 200px;
  display: flex;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  margin-top: 10px;
  color: black;
  border-radius: 5px;
  font-size: 16px;
  span{
      width: 70px;
  }
}

</style>
