<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="isOpen" :persistent="persistent">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ msg }}
        </q-card-section>

        <q-card-section v-if="input">
          <q-input
            dense
            v-model="userInput"
            autofocus
            @keyup.enter="prompt = false"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-if="cancel"
            :label="cancelText ? cancelText : 'Ya lo hare mas tarde'"
            color="negative"
            outline
            v-close-popup
          />
          <q-btn
            outline
            label="OK"
            color="primary"
            v-close-popup
            @click="$emit('closed', userInput)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps([
  "open",
  "msg",
  "title",
  "persistent",
  "cancel",
  "cancelText",
  "input",
]);

const userInput = ref("");

const isOpen = ref(false);

watch(
  () => props.open,
  (val) => {
    isOpen.value = val;
  }
);
</script>
