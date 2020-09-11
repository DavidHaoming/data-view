import Vue from 'vue'
import Vuex from 'vuex'
import {getLogin, getUserInfo as getuserinfo} from "@/api";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    auth: false,
    userInfo: {}
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearToken (state) {
      state.token = ''
      localStorage.setItem('token', '')
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      state.auth = true // 获取到用户信息的同时将auth标记为true，当然也可以直接判断userInfo
    }
  },
  actions: {
    async getUserInfo (ctx) {
      return getuserinfo().then(resp => {
        if (resp.data.status === 200) {
          ctx.commit('setUserInfo', resp.data.data)
        }
        return resp
      })
    },
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
