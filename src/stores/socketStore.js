import { defineStore } from 'pinia'
import { ref } from 'vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useRoute } from 'vue-router';


export const useSocketStore = defineStore('socket', () => {
  const socket = ref({});
  const route = useRoute();
  const connectSocket = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    socket.value = new WebSocket(`wss://collabai.frium.top/ws/${route.params.startConferenceId}/${visitorId}?token=${localStorage.getItem('jwt')}`)
  }

  return {
    connectSocket,
    socket
  }
})
