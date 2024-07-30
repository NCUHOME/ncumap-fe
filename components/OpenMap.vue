<script setup lang="ts">
import { ref } from 'vue'
import type { ObjectEvent } from "ol/Object";
import type { View, Feature } from "ol";
import { Style, Icon } from 'ol/style';

const props = defineProps({
    x: Number,
    y: Number
})

const size = ref([256, 256]);
const center = ref([props.x, props.y]);
const extent = ref([0, 0, ...size.value]);

const projection = ref({
    code: "xkcd-image",
    units: "pixels",
    extent: extent,
})

const zoom = ref(3)
const rotation = ref(0)

const currentZoom = ref(zoom.value);
const currentCenter = ref(center.value);

function resolutionChanged(event: ObjectEvent) {
    currentZoom.value = event.target.getZoom();
}

function centerChanged(event: ObjectEvent) {
    currentCenter.value = event.target.getCenter();
}

const view = ref<View>();

const marks = ref({
    "餐厅": center,
    a: [50, 50],
    b: [55, 50],
    c: [60, 50],
    d: [65, 50],
    e: [70, 50],
    f: [75, 50],
})

const selectConditions = inject("ol-selectconditions");

const selectCondition = selectConditions.singleClick;

const featureSelected = (event: ObjectEvent) => {
    const selectedFeatures = event.target.getFeatures();
    selectedFeatures.forEach((feature: any) => {
        const coordinates = feature.getGeometry().getCoordinates();
        view.value?.setCenter(coordinates)
        console.log('选中的标记位置:', coordinates);
    })
};

const selectInteactionFilter = (feature: any) => {
  return feature.values_.name != undefined;
};

const overrideStyleFunction = (feature: Feature, style: Style) => {
    style.setImage(new Icon({
        src: `/${feature.getProperties().name}.svg`,
        scale: 1.3
    }))
    return style
}

defineExpose({
    currentZoom,
    currentCenter
})
</script>

<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:100%;" :controls="[]">
        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection"
            @change:resolution="resolutionChanged" @change:center="centerChanged" :enableRotation="false" :maxZoom="6"
            :minZoom="2" :extent="extent" constrainOnlyCenter />

        <ol-tile-layer>
            <ol-source-xyz url="/tiles/{z}/tile_{x}_{y}.png" :projection="projection" />
        </ol-tile-layer>

        <ol-interaction-select @select="featureSelected" :condition="selectCondition" :filter="selectInteactionFilter">
            <ol-style :overrideStyleFunction="overrideStyleFunction"></ol-style>
        </ol-interaction-select>

        <ol-vector-layer>
            <ol-source-vector>
                <MapMark v-for="(coordinate, index) in Object.values(marks)" :coordinates="coordinate" :key="index" />
            </ol-source-vector>
        </ol-vector-layer>
    </ol-map>
</template>

<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>