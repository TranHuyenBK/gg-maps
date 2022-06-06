import Vue from 'vue'
import Router from 'vue-router'
import GoogleMap from '@/components/GoogleMap'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoogleMap',
      component: GoogleMap
    },
    {
      path: '/maps',
      name: 'AddGoogleMap',
      component: () => import('@/components/AddGoogleMap')
    },
    {
      path: '/cluster',
      name: 'AddGoogleMap',
      component: () => import('@/components/MarkerClustering.vue')
    }
  ],
  mode: 'history'
})
