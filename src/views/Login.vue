<template>
  <el-row type="flex" justify="space-around" :style="`min-height: ${clientHeight}px; width: 100%`" :gutter="20" v-if="from">
    <el-col :span="6" class="login-button-col">
      <div class="login-button-group">
        <el-button plain icon="iconfont icon-aliyun" @click="goRAM" round>&nbsp;&nbsp;&nbsp;阿里云 RAM 登录</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {ALIYUN_OAUTH_URL} from "@/const";
import {getLogin} from "@/api";

export default {
  name: "Login",
  data() {
    return {
      clientHeight: '',
      from: ''
    }
  },
  mounted() {
    this.$message.info('请先登录')
    this.clientHeight = `${document.documentElement.clientHeight - 50}`
    if (this.$route.query.from) {
      this.from = this.$route.query.from
    } else if (this.$route.query.error === "access_denied") {
      this.$message.error("阿里云 RAM 授权出错")
    } else {
      this.loginIng()
    }
  },
  methods: {
    goRAM() {
      window.location.href = ALIYUN_OAUTH_URL + this.from
    },
    loginIng() {
      const loading = this.$loading({
        lock: true,
        text: '登录中...',
        spinner: 'el-icon-loading',
        background: '#fffff6'
      })
      getLogin(this.$route.query.code).then((resp) => {
        this.$store.commit('setToken', resp.data.data.token)
        this.$router.push({path: this.$route.query.state})
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        loading.close()
      })
    }
  }
}
</script>

<style scoped>
@import "//at.alicdn.com/t/font_2015394_kwova1qnq1j.css";

.login-button-col {
  display: flex;
  justify-content: space-around;
}

.login-button-group {
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
}
</style>