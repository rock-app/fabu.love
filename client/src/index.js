// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
import { Button, Dialog, Menu, Input, Switch, Popover, Form, Upload, Progress, Badge, Container, Header, Aside, Main, Footer, Loading, Message, MenuItem, Table, TableColumn, FormItem, Pagination, Radio, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

import router from './router'
import axios from 'axios'
import { configAxios } from './api/basehttp'

import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

// 解决android5.0 上预览界面不显示的问题
import '@babel/polyfill';

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
Vue.use(Badge);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Main);
Vue.use(Footer);
Vue.use(MenuItem);

Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

Vue.use(VueLazyLoad, {
  loading: import('./common/assets/logo.png')
});

// 更新网页标题
document.title = import.meta.env.VITE_DOCUMENT_TITLE;

// 配置接口信息
configAxios();
/* eslint-disable no-extend-native */
Date.prototype.toFormat = function () {
  return `
${this.getFullYear()}-\
${('0' + (this.getMonth() + 1)).match(/\d{2}$/)[0]}-\
${('0' + this.getDate()).match(/\d{2}$/)[0]} \
${('0' + this.getHours()).match(/\d{2}$/)[0]}:\
${('0' + this.getMinutes()).match(/\d{2}$/)[0]}:\
${('0' + this.getSeconds()).match(/\d{2}$/)[0]}`;
}

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// });

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
