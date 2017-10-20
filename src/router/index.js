import Vue from 'vue'
import Router from 'vue-router'
// import HomeView from '@/components/HomeView'
import MapsView from '@/components/MapsView'
import AddMemory from '@/components/AddMemory'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapsView
    },
    {
      path: '/addMemory',
      name: 'AddMemory',
      component: AddMemory
    }
  ]
})
