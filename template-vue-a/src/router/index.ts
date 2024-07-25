import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
  },
]

const router = createRouter({
  // createWebHistory or createWebHashHistory
  history: createWebHashHistory(),
  routes,
})

export default router
