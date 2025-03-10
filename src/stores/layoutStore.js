import { defineStore } from 'pinia'
import { ref } from 'vue';


export const useLayoutStore = defineStore('layout', () => {
  const layoutRequestState = ref(false);

  return {
    layoutRequestState
  }
})
