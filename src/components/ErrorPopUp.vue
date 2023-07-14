<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="isOpen" @hide="$emit('closed')">
      <q-card>
        <q-card-section>
          <div class="text-h6">Error</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ error }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["open", "error"]);

const isOpen = ref(false);

watch(
  () => props.open,
  (val) => {
    isOpen.value = val;
  }
);
</script>
