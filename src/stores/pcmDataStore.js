import { defineStore } from 'pinia';
import { getConferenceSpeechAPI, uploadConferenceSpeechAPI } from '@/api/conference';
import { ElMessage } from 'element-plus';
import { ref, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

export const usePcmStore = defineStore('pcm', () => {
  const route = useRoute();
  const isRecording = ref(false);
  const result = ref('');
  const SEND_INTERVAL = 100;
  let sendInterval;
  let getInterval;
  let audioContext;
  let recorder;
  const getResult = () => {
    getInterval = setInterval(async () => {
      const res = await getConferenceSpeechAPI(route.params.startConferenceId);
      result.value = res.data.speechText;
    }, 1000);

  };

  class PCMRecorder {
    constructor(audioContext) {
      this.buffers = [];
      this.sampleRate = audioContext.sampleRate;
      this.desiredSampleRate = 16000;
      this.processor = audioContext.createScriptProcessor(4096, 1, 1);
      this.processor.onaudioprocess = (e) => this.processAudio(e);
    }

    processAudio(e) {
      const inputData = e.inputBuffer.getChannelData(0);
      const ratio = this.sampleRate / this.desiredSampleRate;
      const newLength = Math.round(inputData.length / ratio);
      const result = new Float32Array(newLength);
      let offsetResult = 0;
      let offsetInput = 0;
      while (offsetInput < inputData.length) {
        const nextOffsetInput = Math.round((offsetResult + 1) * ratio);
        let sum = 0;
        let count = 0;
        for (let i = offsetInput; i < nextOffsetInput && i < inputData.length; i++) {
          sum += inputData[i];
          count++;
        }
        result[offsetResult] = sum / count;
        offsetResult++;
        offsetInput = nextOffsetInput;
      }
      const pcmData = new Int16Array(result.length);
      for (let i = 0; i < result.length; i++) {
        const s = Math.max(-1, Math.min(1, result[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      this.buffers.push(pcmData);
    }

    start(stream) {
      this.buffers = [];
      const audioInput = audioContext.createMediaStreamSource(stream);
      audioInput.connect(this.processor);
      this.processor.connect(audioContext.destination);
    }

    stop() {
      if (this.audioInput) {
        this.audioInput.disconnect();
        this.processor.disconnect();
      }
    }

    getAudioData() {
      if (this.buffers.length === 0) return null;
      const totalLength = this.buffers.reduce((sum, buf) => sum + buf.length, 0);
      const result = new Int16Array(totalLength);
      let offset = 0;
      for (const buffer of this.buffers) {
        result.set(buffer, offset);
        offset += buffer.length;
      }
      this.buffers = [];
      return result.buffer;
    }
  }


  onBeforeUnmount(() => {
    if (isRecording.value) {
      stopRecording();
    }
  });


  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    recorder = new PCMRecorder(audioContext);
    recorder.start(stream);
    isRecording.value = true;
    sendInterval = setInterval(async () => {
      const audioData = recorder.getAudioData();
      if (audioData) {
        await uploadConferenceSpeechAPI(route.params.startConferenceId, audioData);
      }
    }, SEND_INTERVAL);
    getResult();

  };

  const stopRecording = () => {
    if (isRecording.value) {
      clearInterval(sendInterval);
      clearInterval(getInterval);
      recorder.stop();
      isRecording.value = false;
    }
  };
  return {
    startRecording,
    stopRecording,
    result
  }
});

