import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(Router)

const AppList = () => import('components/AppList')

export default new Router({
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
    }
  ]
})
