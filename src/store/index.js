import Vue from 'vue'
import Vuex from 'vuex'
import {getLogin} from "@/api"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    auth: false,
    userInfo: {},
    organization: [],
    defaultDialogueContent: `{"nodeData":{"id":"root","topic":"新互动","root":true,"children":[]},"linkData":{}}`
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
      console.log('set token success', )
    },
    clearToken (state) {
      state.token = ''
      localStorage.setItem('token', '')
      console.log('clean token success', )
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      state.auth = true // 获取到用户信息的同时将auth标记为true，当然也可以直接判断userInfo
    },
    setOrganization (state, organization) {
      state.organization = organization
    }
  },
  actions: {
    async login (ctx, code) {
      return getLogin(code).then((resp) => {
        ctx.commit('setToken', resp.data.data.token)
        return resp
      })
    }
  },
  modules: {
  }
})
