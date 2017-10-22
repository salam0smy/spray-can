import Vue from 'vue'
import Router from 'vue-router'
// import HomeView from '@/components/HomeView'
import MapsView from '@/components/MapsView'
import AddMemory from '@/components/AddMemory'
import Auth from '@/components/Auth'
import MainShell from '@/components/MainShell'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainShell,
      children: [
        {
          path: '',
          component: MapsView
        },
        {
          path: 'addMemory',
          name: 'AddMemory',
          component: AddMemory
        },
        {
          path: '/auth',
          name: 'auth',
          component: Auth
        }
      ]
    }
  ]
})
