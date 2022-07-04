import {createRouter, createWebHistory} from 'vue-router'

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: "Home",
      component: () => import('@/views/Home/Home.vue')
    },
    {
      path: '/info',
      name: "Info",
      component: () => import('@/views/Info/Info.vue')
    }
  ]
})

export default router
