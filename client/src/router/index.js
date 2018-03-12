import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/loginRegiest/Login.vue'
import Regiest from '../components/loginRegiest/regiest.vue'
import AppDetail from '../components/appDetail/appDetail.vue'
import AppPreView from '../components/appDetail/appPreView.vue'

Vue.use(Router)

const AppList = () => import('components/appList/appList.vue')

export default new Router({
  // 去除#
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/applist',
      name: 'AppList',
      component: AppList
    },
    {
      path: '/regiest',
      name: 'Regiest',
      component: Regiest
    },
    {
      path: '/appDetail',
      name: 'AppDetail',
      component: AppDetail
    },
    {
      path: '/appPreView',
      name: 'AppPreView',
      component: AppPreView
    }
  ]
})
