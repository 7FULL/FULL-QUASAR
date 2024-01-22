<template>
  <div class="flex flex-center all bg-black">
    <Player
      autoplay
      class="dp-block wlg"
      @vm-error="playbackEnded = true"
      @vmReady="error = false"
      v-if="!playbackEnded"
    >
      <Hls version="1.4.14" live>
        <!--<source
            data-src="http://localhost:8080/hls/test.m3u8"
            type="application/x-mpegURL"
          />-->
        <source :data-src="props.src" type="application/x-mpegURL" />
      </Hls>
      <DefaultUi noControls>
        <Scrim />

        <Controls fullWidth pin="topLeft">
          <ControlSpacer />
          <MuteControl class="cl-wh fs-xl" />
        </Controls>

        <Controls pin="center">
          <PlaybackControl hideTooltip class="cl-wh play" />
        </Controls>

        <Controls fullWidth pin="bottomLeft">
          <span class="cl-wh q-mr-sm height">
            <span class="fs-xxxxxxl cl-re">.</span>
            LIVE
          </span>
        </Controls>

        <Controls fullWidth pin="bottomLeft">
          <ControlSpacer />
          <FullscreenControl class="cl-wh fs-xl" hideTooltip />
        </Controls>
      </DefaultUi>
    </Player>

    <div v-if="error && !playbackEnded" class="wlg flex flex-center bg-black">
      <q-spinner-ios size="100px" color="white" />
    </div>

    <div v-if="playbackEnded" class="wlg flex flex-center bg-black">
      <div class="text-h3 text-white">Transmisión finalizada</div>
    </div>

    <!-- Chat -->

    <div
      class="chat-container wsm bg-white"
      v-if="conected"
      ref="chatContainer"
    >
      <div class="chat-messages" id="chat-messages">
        <div v-for="message in messages" :key="message.id" class="chat-message">
          <div class="chat-message-author">{{ message.author }}</div>
          <div class="chat-message-content">{{ message.content }}</div>
        </div>
      </div>
      <div class="chat-input">
        <q-input
          class="wxl"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          outlined
          dense
          placeholder="Escribe tu mensaje..."
          maxlength="100"
        />
        <q-btn
          @click="sendMessage"
          color="primary"
          dense
          label="Enviar"
          class="q-ml-md"
        />
      </div>
    </div>
    <!-- Conectando... -->
    <div
      class="wsm flex flex-center bg-white chat-container"
      v-else-if="!errorConnectingChat"
    >
      <q-spinner-ios size="100px" color="primary" />
    </div>
    <!-- Error -->
    <div
      v-if="!conected && errorConnectingChat"
      class="wsm flex flex-center bg-white chat-container"
    >
      <div class="text-h6 text-black">No se pudo conectar al chat</div>
    </div>
  </div>
</template>

<script setup>
import {
  Player,
  Hls,
  DefaultUi,
  Scrim,
  Controls,
  ControlSpacer,
  MuteControl,
  PlaybackControl,
  FullscreenControl,
} from "@vime/vue-next";

import { ref } from "vue";

import { io } from "socket.io-client";

import { userDataStore } from "../stores/userData.js";

const socket = io("http://localhost:3000");

const props = defineProps(["src", "room"]);

const conected = ref(false);

const playbackEnded = ref(false);

const errorConnectingChat = ref(false);

socket.on("connect", () => {
  conected.value = true;
  socket.emit("join-room", props.room);
});

// En caso de que no se llegue a conectar
setTimeout(() => {
  if (!conected.value) {
    errorConnectingChat.value = true;
  }
}, 5000);

const error = ref(true);

const userStore = userDataStore();

const messages = ref([]);

const newMessage = ref("");

const errorReceived = () => {
  playbackEnded.value = true;
  error.value = true;
};

socket.on("receive-chat-message", (message, author) => {
  printMessage(message, author);
});

function sendMessage() {
  socket.emit(
    "send-chat-message",
    newMessage.value,
    userStore.userData.name,
    props.room
  );

  if (newMessage.value.trim() !== "") {
    printMessage(newMessage.value, "Tu");
    newMessage.value = "";
  }
}

function printMessage(message, author) {
  messages.value.push({
    id: messages.value.length + 1,
    author: author,
    content: message,
  });

  setTimeout(() => {
    scrollToBottom();
  }, 25);
}

function handleScroll() {
  const chatMessages = document.getElementById("chat-messages");
  let scrollPercentage =
    (chatMessages.scrollTop /
      (chatMessages.scrollHeight - chatMessages.clientHeight)) *
    100;

  if (!isNaN(scrollPercentage)) {
    console.log(scrollPercentage);
    if (scrollPercentage < 10) {
      return true;
    }
    if (scrollPercentage < 75) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

function scrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  let x = handleScroll();

  if (x) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
</script>

<style scoped>
.all {
  max-height: 100%;
}

.height {
  height: 4rem;
}

.play {
  font-size: xxx-large;
  margin: auto;
}

.fullscreen {
  display: inline-block;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 40rem;
  overflow-y: hidden;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
}

.chat-message-content{
  word-wrap: break-word;
}

.chat-message {
  margin-bottom: 10px;
}

.chat-message-author {
  font-weight: bold;
  word-wrap: break-word;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
