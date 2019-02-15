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
      component: resolve => require(['@/components/main/main.vue'], resolve),
      children: [
        {
          path: '/apps',
          component: resolve => require(['@/components/appList/appList.vue'], resolve)
        },
        {
          path: '/app/:appId',
          name: 'AppDetail',
          component: resolve => require(['@/components/appDetail/appDetail.vue'], resolve)
        },
        {
          path: '/members',
          name: 'TeamMgr',
          component: resolve => require(['@/components/team/teamMgr.vue'], resolve)
        },
        {
          path: '/miniAppList',
          name: 'MiniAppList',
          component: resolve => require(['@/components/miniApplication/miniAppList.vue'], resolve)
        },
        {
          path: '/miniApp/:appId',
          name: 'MiniAppDetail',
          component: resolve => require(['@/components/miniApplication/miniAppDetail.vue'], resolve)
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/components/auth/auth.vue'], resolve)
    },
    {
      path: '/user',
      name: 'UserInfo',
      component: resolve => require(['@/components/user/userInfo.vue'], resolve)
    },
    {
      path: '/:id',
      name: 'AppPreView',
      component: resolve => require(['@/components/appDetail/appPreView.vue'], resolve)
    }
  ]
})

