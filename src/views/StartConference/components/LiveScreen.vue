<script setup>
import { ref, onMounted } from 'vue'
import { createPeerConnection, createVideoEle, getLocalMediaStream, getLocalScreenMediaStream, setLocalVideoStream, setRemoteVideoStream } from "@/utils/common.js";
import io from 'socket.io-client';

// 使用 ref 引用 DOM 元素
const roomInput = ref(null)
const userInput = ref(null);
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


onMounted(async () => {
  let localStream = await getLocalMediaStream({ video: true, audio: true });
  setLocalVideoStream(offerVideo.value, localStream);
  startBtn.value.addEventListener('click', async () => {
    let roomId = roomInput.value.value;
    let userId = userInput.value.value;

    let isInit = false;
    const serverUrl = "wss://192.168.1.122:3333";
    const options = {
      reconnectDelayMat: 10000,
      transports: ["websocket"],
      query: {
        roomId,
        userId
      }
    }
    let client = new io(serverUrl, options);
    client.on("connect", () => {
      console.log("Connection successful!");
    })
    client.on("disconnect", () => {
      console.log("Connection disconnect!");
    })
    client.on("error", () => {
      console.log("Connection error!");
    })
    client.on('room-msg', (data) => {
      console.log(data);
    })
    client.on('user-id-list-msg', async (userIdList) => {
      roomUserIdList = userIdList;
      connectingUserIdList = roomUserIdList.filter(item => item !== userId);
      // console.log(connectingUserIdList);
      for (let id of connectingUserIdList) {
        let peer = peerMap.get(id);
        if (!peer) {
          peer = createPeerConnection();
          peer.createDataChannel("data-channel")
          peerMap.set(id, peer)
          /**
           * @param {RTCPeerConnectionIceEvent} event
           */
          peer.onicecandidate = (event) => {
            // console.log("candidate");
            if (event.candidate) {
              client.emit("candidate-msg", {
                fromUserId: userId,
                toUserId: id,
                candidate: event.candidate
              })
            }
          }
          /**
           * @param {RTCTrackEvent} event
           */
          peer.ontrack = (event) => {
            let videoEle = createVideoEle(id);
            setRemoteVideoStream(videoEle, event.track)
          }
          peer.ondatachannel = (e) => {
            console.log("DataChannel is created");
            // console.log("ondatachannel", e);
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
        console.log(connectingUserIdList, fromUserId, "offer");
        /**
         * @type {RTCPeerConnection}
         */
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
        console.log(connectingUserIdList, fromUserId, "answer");
        /**
        * @type {RTCPeerConnection}
        */
        let peer = peerMap.get(fromUserId);
        if (peer) {
          await peer.setRemoteDescription(sdp);
        }
      }
    })
    // 交换candiate信息
    client.on('candidate-msg', async (data) => {
      let { fromUserId, toUserId, candidate } = data
      if (userId === toUserId) {
        // console.log(connectingUserIdList, fromUserId, "candidate");
        /**
          * @type {RTCPeerConnection}
          */
        let peer = peerMap.get(fromUserId);
        if (peer) {
          await peer.addIceCandidate(candidate)
        }
      }
    })
    client.on('client-leave', (data) => {
      console.log(data);
    })
  });

  stopBtn.value.addEventListener("click", () => {
    isStopAudio = !isStopAudio;
    isStopVideo = !isStopVideo;
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
    if (newStream) {
      localStream = newStream;
      setLocalVideoStream(offerVideo, localStream);
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

</script>

<template>
  <div style="width: 1000px; height: 1000px; background: goldenrod;">
    <input ref="roomInput" id="roomId" type="text" value="会议房间1" placeholder="请输入房间号" />
    <input ref="userInput" id="userId" type="text" value="123" placeholder="请输入用户昵称" />
    <button ref="startBtn" class="startBtn">开始通话</button>
    <button ref="stopBtn" class="stopBtn">暂停/恢复通话</button>
    <button ref="videoBtn" class="videoBtn">视频通话</button>
    <button ref="screenBtn" class="screenBtn">屏幕共享</button>
    <div class="video-container">
      <video ref="offerVideo" autoplay controls muted></video>
      <!-- 确保这里使用 ref 而不是 id -->
    </div>
  </div>
</template>
<style scoped lang="scss">
.video-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border: 1px dashed pink;
}

.video-container video {
  border: 1px dashed pink;
  width: 35%;
  height: 35%;
}
</style>