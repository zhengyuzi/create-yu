import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home.vue'),
      }
    ],
  },
  // {
  //   path: '/:pathMatch(.*)',
  //   name: 'Error',
  //   component: () => import('@/pages/error/index.vue'),
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
