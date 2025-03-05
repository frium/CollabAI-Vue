import { defineStore } from 'pinia'
import { reactive } from 'vue';


export const useUserStore = defineStore('user', () => {
  const userInfo = reactive({
    "username": "",
    "email": "",
    "phone": "",
    "nickname": "",
    "avatar": "",
    "info": "",
    "gender": 0,
    "birthday": "",
    "location": ""
  })

  return {
    userInfo
  }
})
