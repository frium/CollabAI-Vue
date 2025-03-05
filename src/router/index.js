import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Home/index.vue'),
      children: [
        {
          path: ""
        },
        {
          name: 'home',
          path: 'home'
        },
        {
          name: 'personalCenter',
          path: 'personalCenter',
          component: () => import('@/views/PersonalCenter/index.vue')
        },
        {
          name: 'joinConference',
          path: 'joinConference/:conferenceId?',
          component: () => import('@/views/JoinConference/index.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      children: [
        {
          name: 'login',
          path: "",
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
