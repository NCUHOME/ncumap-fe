<script setup>
import { ref } from 'vue'
const size = ref([256, 256]);
const center = ref([size.value[0] / 2, size.value[1] / 2]);
const extent = ref([0, 0, ...size.value]);
const projection = ref({
    units: "pixels",
    extent: extent,
})
const zoom = ref(0)
const rotation = ref(0)
const currentZoom = ref(zoom.value);

function resolutionChanged(event) {
    currentZoom.value = event.target.getZoom();
}

defineExpose({
    currentZoom
})
</script>

<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:100%;">
        <ol-view :center="center" :rotation="rotation" :zoom="zoom" :projection="projection"
            @change:resolution="resolutionChanged" />
        <ol-tile-layer>
            <ol-source-xyz url="/tiles/{z}/tile_{x}_{y}.png" :projection="projection" />
        </ol-tile-layer>
    </ol-map>
</template>

<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>