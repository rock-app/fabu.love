// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import {configAxios} from './api/basehttp'

import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll)

Vue.config.productionTip = false
Vue.prototype.axios = axios

Vue.prototype.router = router

Vue.use(ElementUI)

Vue.use(VueLazyLoad, {
  loading: require('./assets/logo.png')
})

// 配置接口信息
configAxios()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
