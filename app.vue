<template>
  <div style="height: 100vh;width: 100%;position: absolute;">
    <ClientOnly>
      <OpenMap ref="map"/>
      <template #fallback> Loading map... </template>
    </ClientOnly>
  </div>
  <div style="position: absolute;right: 0;" v-if="map != null">
    <p>{{ map.currentZoom }}</p>
  </div>
</template>

<script setup>
import OpenMap from './components/OpenMap.vue';
import { ref } from 'vue';
const map = ref(null)
</script>

<style>
body {
  margin: 0;
  height: 100vh;
}
</style>