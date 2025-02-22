import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/Home/index.vue') },
    { path: '/login', component: () => import('@/views/Login/index.vue') }
  ],
})

export default router
