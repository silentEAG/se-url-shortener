// 请求配置过程的代码是这样的
import axios from "axios";

const requests = axios.create({
    // 配置对象
    baseURL: "http://localhost:8006", // 这里写自己的域名
    timeout: 5000,
    // withCredentials: true, //异步请求携带Cookie
    headers: { // 这里的参数可以根据自己的需要设置 不需要的可以不设置
        "Content-Type": "application/json",
        "App-Version": "1.0",
    }
})

// 配置请求拦截器
requests.interceptors.request.use((config) => {
    // config 配置对象 请求头
    return config
})

// 响应拦截器
requests.interceptors.response.use((resp) => {
    // 请求成功
    return resp.data
}, (error) => {
    console.log('请求失败....................')

    return Promise.error(new Error("请求失败"))
})

export default requests