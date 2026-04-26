
// src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

// 2. 注册ElementUI
Vue.use(ElementUI)
// 3. 挂载axios到Vue原型
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 500) {
      console.error('服务器异常：', error)
      alert('服务器繁忙，请稍后重试！')
    }
    return Promise.reject(error)
  }
)