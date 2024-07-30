<script setup>
import { ref } from 'vue'

const props = defineProps({
    x: Number,
    y: Number
})

const size = ref([256, 256]);
const center = ref([props.x, props.y]);
const extent = ref([0, 0, ...size.value]);

const projection = ref({
    units: "pixels",
    extent: extent,
})

const zoom = ref(3)
const rotation = ref(0)

const currentZoom = ref(zoom.value);
const currentCenter = ref(center.value);

function resolutionChanged(event) {
    currentZoom.value = event.target.getZoom();
}

function centerChanged(event) {
  currentCenter.value = event.target.getCenter();
}

defineExpose({
    currentZoom,
    currentCenter
})
</script>

<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:100%;" :controls="[]">
        <ol-view :center="center" :rotation="rotation" :zoom="zoom" :projection="projection"
            @change:resolution="resolutionChanged" @change:center="centerChanged" :enableRotation="false" />
        <ol-tile-layer>
            <ol-source-xyz url="/tiles/{z}/tile_{x}_{y}.png" :projection="projection" />
        </ol-tile-layer>
    </ol-map>
</template>

<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>