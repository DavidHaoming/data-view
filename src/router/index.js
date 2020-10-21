import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login"
import store from '@/store'
import Creation from "@/views/Creation"
import {getUserInfo, getUserAdminOrganization} from "@/api/graphql/user";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/creation'
  },
  {
    name: 'login', path: '/login', component: Login, meta: {isPublic: true}
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  { path: '/creation/:type/:id?', name: 'Creation', component: Creation},
]

const router = new VueRouter({
  mode: process.env.NODE_ENV === 'development' ? 'history' : 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.matched.some((record) => {
    // return record.meta.isPublic || process.env.NODE_ENV === 'development'
    return record.meta.isPublic
    // return true // 先都打开
  })) { // 默认都需要登录权限, 除非 public 或者在开发环境
    if (!store.state.auth) { // 检查是否已登录
      if (store.state.token) { // 未登录，但是有token，获取用户信息
        try {
          getUserInfo().then(res => {
            store.commit('setUserInfo', res.data.getLoginUser)
            getUserAdminOrganization().then(res => {
              store.commit('setOrganization', res.data.getAllOrganizations)
            }).catch(() => {
              console.log("无组织")
            })
            next()
          }).catch((err) => {
            console.log('get user info api err: ', err)
            store.commit('clearToken')
            next({ name: 'login', query: {from: to.path} })
          })
        } catch (err) {
          console.log('get user info run err: ', err)
          store.commit('clearToken')
          next({ name: 'login', query: {from: to.path} })
        }
      } else {
        next({ name: 'login', query: {from: to.path} })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

