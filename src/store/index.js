import Vue from 'vue'
import Vuex from 'vuex'
import {getLogin} from "@/api"
import {nodeTemplateList, nodeAttributeTemplate} from "./var"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    auth: false,
    userInfo: {},
    organization: [],
    defaultDialogueContent: `{"nodeData":{"id":"root","topic":"新互动","root":true,"children":[]},"linkData":{}}`,
    nodeTemplate: nodeTemplateList,
    nodeAttributeTemplate: nodeAttributeTemplate,
    predefineColors: [
      '#2c3e50',
      '#34495e',
      '#7f8c8d',
      '#94a5a6',
      '#bdc3c7',
      '#ecf0f1',
      '#8e44ad',
      '#9b59b6',
      '#2980b9',
      '#3298db',
      '#c0392c',
      '#e74c3c',
      '#d35400',
      '#f39c11',
      '#f1c40e',
      '#17a085',
      '#27ae61',
      '#2ecc71',
    ],
    viewId: ''
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
    },
    addViewId(state, viewId) {
      state.viewId = viewId
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
