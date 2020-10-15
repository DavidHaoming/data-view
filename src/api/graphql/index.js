import ApolloClient from 'apollo-boost'

import {API_URL} from "@/const"
import store from '@/store'
console.log( store.state.token)
export default new ApolloClient({
    uri: `${API_URL}/api/graph`, // 配置请求url
    headers: {
        Authorization: store.state.token
    }
})