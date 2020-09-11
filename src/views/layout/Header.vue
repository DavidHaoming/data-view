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
        background-color="#0088ff"
        text-color="#f2f2f2"
        active-text-color="#f2f2f2">
      <el-menu-item v-for="(i, item) in navList" :key="item" index="item">{{ i.name }}</el-menu-item>
    </el-menu>
    <div class="dropMenu">
      <el-dropdown>
        <span style="cursor: pointer;"><i style="color: #f2f2f2" class="el-icon-circle-plus el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item of newCreateChoiceData" :key="item.name">{{item.name}}</el-dropdown-item>
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
  </div>
</template>

<script>
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
      newCreateChoiceData: [
        {name: '步骤', id: 'step'}, {name: '互动', id: 'talk'}, {name: '桶', id: 'bucket'}, {name: '组织', id: 'organization'}
      ]
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