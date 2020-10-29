import ApolloClient from 'apollo-boost'

import {API_URL} from "@/const"
import store from '@/store'

const ac = function () {
    console.log('token', store.state.token)
    // 以 function 的方式避免实例过早初始化取不到 token
    return new ApolloClient({
        uri: `${API_URL}/api/graph`, // 配置请求url
        headers: {
            Authorization: store.state.token
        },
    })
}

export default ac