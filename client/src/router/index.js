import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/loginRegiest/Login.vue'
import Regiest from '../components/loginRegiest/regiest.vue'
import AppDetail from '../components/appDetail/appDetail.vue'
import AppPreView from '../components/appDetail/appPreView.vue'
import UserInfo from '../components/user/userInfo.vue'
import Main from '../components/main/main.vue'

Vue.use(Router)

const Apps = () => import('components/appList/appList.vue')

export default new Router({
  // 去除#
  mode: 'history',
  routes: [
    {
      path: '',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/apps',
          name: 'Apps',
          component: Apps
        },
        {
          path: '/app/:appId',
          name: 'AppDetail',
          component: AppDetail
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/regiest',
      name: 'Regiest',
      component: Regiest
    },
    {
      path: '/user',
      name: 'UserInfo',
      component: UserInfo
    },
    {
      path: '/:id',
      name: 'AppPreView',
      component: AppPreView
    }
  ]
})

