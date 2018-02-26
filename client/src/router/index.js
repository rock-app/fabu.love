import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const AppList = () => import('components/AppList')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AppList',
      component: AppList
    }
  ]
})
