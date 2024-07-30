<template>
    <div style="height: 100vh;width: 100%;position: absolute;">
        <ClientOnly>
            <OpenMap ref="map" :x="location.x" :y="location.y" />
            <template #fallback> Loading map... </template>
        </ClientOnly>
    </div>
    <div style="position: absolute;right: 0;" v-if="map != null">
        <p>{{ map.currentZoom }}</p>
        <p>{{ map.currentCenter }}</p>
    </div>
</template>

<script setup>
import OpenMap from '../components/OpenMap.vue';
import { ref } from 'vue';

const route = useRoute()
const map = ref(null)
const location = ref({
    x: 100,
    y: 100
})

if (route.query.x && route.query.y) {
    location.value.x = parseInt(route.query.x);
    location.value.y = parseInt(route.query.y);
}
</script>
