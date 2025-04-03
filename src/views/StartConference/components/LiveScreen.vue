<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { createPeerConnection, createVideoEle, getLocalMediaStream, getLocalScreenMediaStream, setLocalVideoStream, setRemoteVideoStream } from "@/utils/common.js";
import io from 'socket.io-client';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { usePcmStore } from '@/stores/pcmDataStore';
import { useConferenceStore } from '@/stores/conferenceStore';

const route = useRoute();
const pcmStroe = usePcmStore();
const userStore = useUserStore();
const startBtn = ref(null);
const stopBtn = ref(null);
const videoBtn = ref(null);
const screenBtn = ref(null);
const offerVideo = ref(null);
let peerMap = new Map();
let roomUserIdList;
let connectingUserIdList = [];
let isStopAudio = false;
let isStopVideo = false;
let audioStream = null;

const conferenceStore = useConferenceStore();

const status = computed(() => {
  const now = new Date();
  const startTime = new Date(conferenceStore.startConferenceInfo.startTime);
  const endTime = new Date(conferenceStore.startConferenceInfo.endTime);
  return now >= startTime && now <= endTime;
});

onMounted(async () => {
  if (!status) return;
  pcmStroe.getResult();
  let roomId = route.params.statConferenceId;
  let userId = userStore.userInfo.username;
  let client;
  let localStream;
  startBtn.value.addEventListener('click', async () => {
    offerVideo.value.style.display = "block";
    localStream = await getLocalMediaStream({ video: true, audio: true });
    setLocalVideoStream(offerVideo.value, localStream);
    audioStream = new MediaStream(localStream.getAudioTracks());
    pcmStroe.startRecording(audioStream);
    let isInit = false;
    const serverUrl = "wss://frium.top:3333";
    const options = {
      reconnectDelayMat: 10000,
      transports: ["websocket"],
      query: {
        roomId,
        userId
      }
    }
    client = new io(serverUrl, options);
    client.on('user-id-list-msg', async (userIdList) => {
      roomUserIdList = userIdList;
      connectingUserIdList = roomUserIdList.filter(item => item !== userId);
      for (let id of connectingUserIdList) {
        let peer = peerMap.get(id);
        if (!peer) {
          peer = createPeerConnection();
          peer.createDataChannel("data-channel")
          peerMap.set(id, peer)

          peer.onicecandidate = (event) => {
            if (event.candidate) {
              client.emit("candidate-msg", {
                fromUserId: userId,
                toUserId: id,
                candidate: event.candidate
              })
            }
          }

          peer.ontrack = (event) => {
            let videoEle = createVideoEle(id);
            setRemoteVideoStream(videoEle, event.track);
          }
          localStream.getTracks().forEach(track => {
            peer.addTrack(track, localStream)
          });
          if (!isInit) {
            let offerSDP = await peer.createOffer()
            await peer.setLocalDescription(offerSDP)
            client.emit("offer-sdp-msg", {
              fromUserId: userId,
              toUserId: id,
              sdp: offerSDP
            });
          }
        }
      }
      isInit = true
    })
    client.on('offer-sdp-msg', async (data) => {
      let { fromUserId, toUserId, sdp } = data
      if (userId === toUserId) {
        let peer = peerMap.get(fromUserId);
        if (peer) {
          await peer.setRemoteDescription(sdp)
          let answerSDP = await peer.createAnswer();
          await peer.setLocalDescription(answerSDP)
          client.emit("answer-sdp-msg", {
            fromUserId: toUserId,
            toUserId: fromUserId,
            sdp: answerSDP
          })
        }
      }
    })
    client.on('answer-sdp-msg', async (data) => {
      let { fromUserId, toUserId, sdp } = data;
      if (userId === toUserId) {
        let peer = peerMap.get(fromUserId);
        if (peer) {
          await peer.setRemoteDescription(sdp);
        }
      }
    })

    client.on('candidate-msg', async (data) => {
      let { fromUserId, toUserId, candidate } = data
      if (userId === toUserId) {
        let peer = peerMap.get(fromUserId);
        if (peer) {
          await peer.addIceCandidate(candidate)
        }
      }
    })
    client.on('client-leave', (userId) => {
      const video = document.getElementById("video" + userId)
      if (video) video.parentElement.removeChild(video);
    })

    client.on('remove-viedo', (userId) => {
      const video = document.getElementById("video" + userId);
      if (video) video.style.display = 'none';
      ElMessage.warning(userId + '关闭了会议共享!')

    })

    client.on('open-video', (userId) => {
      const video = document.getElementById("video" + userId)
      if (video) video.style.display = 'block'
      ElMessage.success(userId + '打开了会议共享!')
    })
  });

  stopBtn.value.addEventListener("click", () => {
    isStopAudio = !isStopAudio;
    isStopVideo = !isStopVideo;
    if (isStopAudio) {
      offerVideo.value.style.display = 'none';
      client.emit('stop', userId);
      pcmStroe.stopRecording();
      ElMessage.success("退出通话成功!")
    }
    else {
      offerVideo.value.style.display = 'block';
      client.emit('open', userId);
      pcmStroe.startRecording(audioStream);
      ElMessage.success("加入通话成功!")
    }

    for (let id of connectingUserIdList) {
      let peer = peerMap.get(id);
      if (peer) {
        peer.getSenders().find(sender => sender.track.kind === 'audio').track.enabled = !isStopAudio;
        peer.getSenders().find(sender => sender.track.kind === 'video').track.enabled = !isStopVideo;
      }
    }
  })

  videoBtn.value.addEventListener("click", async () => {
    let newStream = await getLocalMediaStream({
      video: true,
      audio: true
    })
    if (newStream) {
      localStream = newStream;
      ElMessage.success('切换视频通话成功!');
      setLocalVideoStream(offerVideo.value, localStream);
      localStream.getVideoTracks().forEach(track => {
        for (let id of connectingUserIdList) {
          let peer = peerMap.get(id);
          if (peer) {
            peer.getSenders().find(sender => sender.track.kind === 'video').replaceTrack(track)
          }
        }
      })
    }
  })
  screenBtn.value.addEventListener("click", async () => {
    let newStream = await getLocalScreenMediaStream({
      video: {
        cursor: 'always' | 'motion' | 'never',
        displaySurface: 'application' | 'browser' | 'monitor' | 'window'
      }
    });
    ElMessage.success('切换屏幕共享成功!');
    if (newStream) {
      localStream = newStream;
      setLocalVideoStream(offerVideo.value, localStream);
      localStream.getVideoTracks().forEach(track => {
        for (let id of connectingUserIdList) {
          let peer = peerMap.get(id);
          if (peer) {
            peer.getSenders().find(sender => sender.track.kind === 'video').replaceTrack(track)
          }
        }
      })
    }
  })
})

onUnmounted(() => {
  pcmStroe.stopRecording();
})
</script>

<template>
  <div class="live-screen" v-if="status">
    <el-dropdown trigger="click" class="function-nav">
      <img src="@/assets/icons/setting2.svg" alt="">
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <button ref="startBtn" class="button-item">加入视频会议</button>
          </el-dropdown-item>
          <el-dropdown-item>
            <button ref="stopBtn" class="button-item">暂停/恢复通话</button>
          </el-dropdown-item>
          <el-dropdown-item>
            <button ref="videoBtn" class="button-item">视频通话</button>
          </el-dropdown-item>
          <el-dropdown-item>
            <button ref="screenBtn" class="button-item">屏幕共享</button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="video-container">
      <video ref="offerVideo" autoplay controls muted style="display: none;"></video>
    </div>
  </div>
</template>
<style scoped lang="scss">
.live-screen {
  position: relative;
  width: 100%;
  min-height: 650px;
  background-color: rgba(196, 196, 196, 0.75);
  user-select: none;

  .function-nav {
    position: absolute;
    top: 12px;
    right: 15px;


    &:hover {
      img {
        transform: rotate(180deg);
      }
    }

    img {
      width: 26px;
      margin: auto;
      transition: transform 0.2s;
    }
  }

  .video-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3%;
  }

}
</style>

<style>
.live-screen .video-container video {
  width: 31%;
  height: 46%;
}
</style>
