import Vue from 'vue'
import Router from 'vue-router'
// import User from '../components/auth/auth.vue'
// import AppDetail from '../components/appDetail/appDetail.vue'
// import AppPreView from '../components/appDetail/appPreView.vue'
// import UserInfo from '../components/user/userInfo.vue'
// import Main from '../components/main/main.vue'
// import Apps from '../components/appList/appList.vue'
// import TeamMgr from '../components/team/teamMgr.vue'

Vue.use(Router)

export default new Router({
  // 去除#
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/apps',
      component: () => import('../components/main/main.vue'),
      children: [
        {
          path: '/apps',
          component: () => import('../components/appList/appList.vue')
        },
        {
          path: '/app/:appId',
          name: 'AppDetail',
          component: () => import('../components/appDetail/appDetail.vue')
        },
        {
          path: '/members',
          name: 'TeamMgr',
          component: () => import('../components/team/teamMgr.vue')
        },
        {
          path: '/miniAppList',
          name: 'MiniAppList',
          component: () => import('../components/miniApplication/miniAppList.vue')
        },
        {
          path: '/miniApp/:appId',
          name: 'MiniAppDetail',
          component: () => import('../components/miniApplication/miniAppDetail.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/auth/auth.vue')
    },
    {
      path: '/user',
      name: 'UserInfo',
      component: () => import('../components/user/userInfo.vue')
    },
    {
      path: '/:id',
      name: 'AppPreView',
      component: () => import('../components/appDetail/appPreView.vue')
    }
  ]
})

