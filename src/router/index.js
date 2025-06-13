import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      children: [
        {
          path: "",
          redirect: { name: 'home' }
        },
        {
          name: 'home',
          path: 'home',
          component: () => import('@/views/Home/index.vue'),
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
        },
        {
          name: 'createConference',
          path: 'createConference',
          component: () => import('@/views/CreatConference/index.vue')
        },
        {
          name: 'startConference',
          path: 'startConference',
          component: () => import('@/views/StartConference/index.vue'),
          children: [
            {
              path: ':startConferenceId',
              redirect: { name: 'conferenceAI' }
            },
            {
              name: 'conferenceAI',
              path: 'conferenceAI/:startConferenceId',
              component: () => import('@/views/StartConference/components/ConferenceAI.vue')
            },
            {
              name: 'editConference',
              path: 'editConference/:startConferenceId',
              component: () => import('@/views/StartConference/components/EditConference.vue')
            },
            {
              name: 'conferenceDetail',
              path: 'conferenceDetail/:startConferenceId',
              component: () => import('@/views/StartConference/components/ConferenceDetail.vue')
            }
          ]
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
