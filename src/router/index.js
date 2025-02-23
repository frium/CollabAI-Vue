import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/home',
      component: () => import('@/views/Home/index.vue')
    },
    {
      path: '/',
      component: () => import('@/views/Login/index.vue'),
      children: [
        {
          path: "",
          component: () => import('@/views/Login/components/Login.vue'),
        },
        {
          name: "login",
          path: "login",
          component: () => import('@/views/Login/components/Login.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/Login/components/Register.vue')
        },
        {
          path: 'password',
          name: 'password',
          component: () => import('@/views/Login/components/Password.vue')
        }
      ]
    }
  ],
})

export default router
