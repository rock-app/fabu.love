// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {Button, Dialog, Menu, Input, Switch, Popover, Form, Upload, Progress, Badge, Container, Header, Aside, Main, Footer, Loading, Message, MenuItem, Table, TableColumn, FormItem, Pagination, Radio, MessageBox} from 'element-ui'

import router from './router'
import axios from 'axios'
import {configAxios} from './api/basehttp'

import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

// 解决android5.0 上预览界面不显示的问题
import 'babel-polyfill'

Vue.use(infiniteScroll)

Vue.config.productionTip = false

Vue.prototype.axios = axios
Vue.prototype.router = router
Vue.prototype.bus = new Vue()

Vue.use(Radio)
Vue.use(FormItem)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Input)
Vue.use(Switch)
Vue.use(Popover)
Vue.use(Form)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Badge)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Main)
Vue.use(Footer)
Vue.use(MenuItem)

Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

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
