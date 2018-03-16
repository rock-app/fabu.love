// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import BaseApi from './api/BaseApi'

Vue.config.productionTip = false
Vue.prototype.axios = axios

Vue.prototype.router = router

Vue.use(ElementUI)

BaseApi.init(router)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
