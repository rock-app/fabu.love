import mitt from "mitt";
import {createApp} from 'vue';
import App from './App.vue';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router'
import axios from 'axios'
import { configAxios } from './api/basehttp'

import VueLazyload from '@jambonn/vue-lazyload'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 解决android5.0 上预览界面不显示的问题
import '@babel/polyfill';

const app = createApp(App).use(router);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.axios = axios;
// app.config.globalProperties.router = router;
app.config.globalProperties.bus = mitt();

app.use(ElementPlus)
app.use(ContextMenu)

app.use(VueLazyload, {
  loading: import('./common/assets/logo.png')
});

// 更新网页标题
document.title = import.meta.env.VITE_DOCUMENT_TITLE;

// 配置接口信息
configAxios();
/* eslint-disable no-extend-native */
Date.prototype.toFormat = function () {
  return `
${ this.getFullYear() }-\
${ ( '0' + ( this.getMonth() + 1 ) ).match(/\d{2}$/)[0] }-\
${ ( '0' + this.getDate() ).match(/\d{2}$/)[0] } \
${ ( '0' + this.getHours() ).match(/\d{2}$/)[0] }:\
${ ( '0' + this.getMinutes() ).match(/\d{2}$/)[0] }:\
${ ( '0' + this.getSeconds() ).match(/\d{2}$/)[0] }`;
}

app.mount('#app')
