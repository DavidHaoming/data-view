import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import {ALIYUN_OAUTH_REDIRECT_URI, API_URL} from "@/const"
import store from '@/store'

axios.defaults.baseURL = `${API_URL}/api`

axios.defaults.headers = {
    'Content-Type': 'application/json',
}
axios.interceptors.request.use(
    config => {
        if (store.state.token) {
            config.headers.Authorization = store.state.token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

Vue.use(VueAxios, axios)

export let getLogin = function (code) {
    return axios.get(`user/login?code=${code}&redirect_uri=${ALIYUN_OAUTH_REDIRECT_URI}`)
}

