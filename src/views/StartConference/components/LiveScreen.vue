<script setup>
import { useSocketStore } from "@/stores/socketStore";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const videoRef = ref(null);
let stream;
let mediaRecorder;
const socketStore = useSocketStore();
const StartRecording = async () => {
  try {
    // 捕获屏幕流
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    // 捕获音频流
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 合并屏幕和音频流
    const combinedStream = new MediaStream([...screenStream.getVideoTracks(), ...audioStream.getAudioTracks()]);

    // 将合并后的流设置为 video 元素的源（可选）
    videoRef.value.srcObject = combinedStream;

    // 创建 MediaRecorder
    const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

    await socketStore.connectSocket();
    // 创建 WebSocket 连接
    console.log(socketStore.socket);

    socketStore.socket.onopen = () => {
      console.log('WebSocket connection established');
      mediaRecorder.start(1000); // 每1秒发送一次数据
    };

    socketStore.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      socketStore.socket.close();
    };

    socketStore.socket.onclose = () => {
      stream = null;
      socket = null;

    };

    socketStore.socket.onmessage = async (event) => {
      console.log(event);

      try {
        const message = JSON.parse(event.data); // 解析 JSON
        console.log(message);
        const base64String = message.data; // 获取 Base64 编码的数据
        const byteArray = Uint8Array.from(atob(base64String), c => c.charCodeAt(0)); // Base64 解码
        const arrayBuffer = byteArray.buffer; // 转换成 ArrayBuffer

        console.log("收到的用户 ID：", message.userId);
        console.log("收到的昵称：", message.nickName);
        console.log("收到的二进制数据：", arrayBuffer);

      } catch (error) {
        console.error("WebSocket 消息解析失败:", error);
      }
    };


    // 当有数据可用时发送到后端
    mediaRecorder.ondataavailable = async (event) => {

      if (event.data.size > 0) {
        const arrayBuffer = await event.data.arrayBuffer();
        const chunkSize = 1024 * 1024; // 比如4KB
        const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);
        console.log(arrayBuffer.byteLength);

        for (let i = 0; i < arrayBuffer.byteLength; i += chunkSize) {
          const chunk = arrayBuffer.slice(i, i + chunkSize);
          const packet = {
            seq: i + 1,
            total: totalChunks,
            data: chunk
          };
          socketStore.socket.send(chunk);
        }
      }
    };

    // 停止录制时关闭 WebSocket
    mediaRecorder.onstop = () => {
      socketStore.socket.close();
    };
  } catch (error) {
    console.error('Error starting screen capture:', error);
    socketStore.socket.close();

  }
};

const StopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  videoRef.value.srcObject = null;
};

</script>

<template>
  <div class="live-screen">
    <video class="custom-video" autoplay controls ref="videoRef"></video>
    <div>
      <button @click="StartRecording">Start Recording</button>
      <button disabled @click="StopRecording">Stop Recording</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.live-screen {
  width: 100%;
}

/* 隐藏时间显示 */
.custom-video::-webkit-media-controls-current-time-display,
.custom-video::-webkit-media-controls-time-remaining-display {
  display: none;
}

/* 隐藏进度条 */
.custom-video::-webkit-media-controls-timeline {
  display: none;
}

/* Firefox 浏览器 */
.custom-video::-moz-range-track {
  display: none;
}

.custom-video {
  width: 100%;
  border: 2px solid #333;
  background-color: #000;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
