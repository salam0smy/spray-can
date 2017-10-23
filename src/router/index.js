import Vue from 'vue'
import Router from 'vue-router'
// import HomeView from '@/components/HomeView'
import MapsView from '@/components/MapsView'
import AddMemory from '@/components/AddMemory'
import Auth from '@/components/Auth'
import MainShell from '@/components/MainShell'
import MemoriesList from '@/components/MemoriesList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Speay Can',
      component: MapsView,
    },
    {
      path: '/addMemory',
      name: 'Add Memory',
      component: AddMemory
    },
    {
      path: '/auth',
      name: 'Login',
      component: Auth
    },
    {
      path: '/memories',
      name: 'Memories',
      component: MemoriesList
    }
  ]
})
