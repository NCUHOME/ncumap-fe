<script setup lang="ts">
import { ref } from 'vue'
import type { ObjectEvent } from "ol/Object";
import type { View, Feature } from "ol";
import { Style, Icon } from 'ol/style';

const convertCoordinates = (coordinates: number[]) => {
    const top = 28.66776098033687   
    const bottom = 28.641503853212868
    const right = 115.81343996831613
    const left = 115.78972714948839
    const blank = 27.8
    const unitY = (top - bottom) / 256
    const unitX = (right - left) / (256 - 2*blank)
    return [(coordinates[0] - left) / unitX + blank, (coordinates[1] - bottom) / unitY]
}

const props = defineProps({
    x: Number,
    y: Number
})

let [centerX, centerY] = convertCoordinates([<number>props.x, <number>props.y])

if (centerX > 256) {
    centerX = 256
} else if(centerX < 0) {
    centerX = 0
}

if (centerY > 256) {
    centerY = 256
} else if(centerY < 0) {
    centerY = 0
}

const size = ref([256, 256]);
const center = ref([centerX, centerY]);
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

const selectConditions = inject("ol-selectconditions");

const selectCondition = selectConditions.singleClick;

const router = useRouter()
const featureSelected = (event: ObjectEvent) => {
    const selectedFeatures = event.target.getFeatures();
    selectedFeatures.forEach((feature: any) => {
        const coordinates = feature.getGeometry().getCoordinates();
        view.value?.setCenter(coordinates)
        router.push(`/${feature.values_.category}/${feature.values_.id}`)
    })
};

const selectInteactionFilter = (feature: any) => {
    return feature.values_.name != undefined;
};

const overrideStyleFunction = (feature: Feature, style: Style) => {
    style.setImage(new Icon({
        src: `/images/marks/${feature.getProperties().category}/${feature.getProperties().id}.svg`,
        scale: 1.3,
        anchor: [0.2, 1]
    }))
    return style
}

const marks = ref<any>(null)
const categories = ref(['全部', '活动'])
const currentCategory = ref(0)

onMounted(async () => {
    try {
        marks.value = await $fetch('/data/marks/data.json')
        categories.value.push(...Object.keys(marks.value))
    } catch (err) {
        alert(err)
    }
})

const viewTo = (coordinates: number[]) => {
    view.value?.setCenter(convertCoordinates(coordinates))
}

const zoomTo = (zoom: number) => {
    view.value?.setZoom(zoom)
}

const backToCenter = () => {
    view.value?.setCenter([centerX, centerY])
}

defineExpose({
    currentZoom,
    currentCenter,
    categories,
    currentCategory,
    marks,
    viewTo,
    zoomTo,
    backToCenter
})
</script>

<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height:100%;" :controls="[]">
        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection"
            @change:resolution="resolutionChanged" @change:center="centerChanged" :enableRotation="false" :maxZoom="6"
            :minZoom="0" :extent="extent" constrainOnlyCenter />
        <ol-tile-layer>
            <ol-source-xyz url="/tiles/{z}/tile_{x}_{y}.png" :projection="projection" />
        </ol-tile-layer>

        <ol-interaction-select @select="featureSelected" :condition="selectCondition" :filter="selectInteactionFilter">
            <ol-style :overrideStyleFunction="overrideStyleFunction"></ol-style>
        </ol-interaction-select>

        <ol-vector-layer>
            <ol-source-vector>
                <template v-if="marks != null">
                    <template v-if="currentCategory == 0">
                        <template v-for="category in categories">
                            <template v-for="mark in marks[category]">
                                <MapMark v-if="mark.priority <= currentZoom"
                                    :coordinates="convertCoordinates(mark.coordinates)" :name="mark.name"
                                    :category="category" :id="mark.id" />
                            </template>
                        </template>
                    </template>
                    <template v-else>
                        <template v-for="mark in marks[categories[currentCategory]]">
                            <MapMark v-if="mark.priority <= currentZoom"
                                :coordinates="convertCoordinates(mark.coordinates)" :name="mark.name"
                                :category="categories[currentCategory]" :id="mark.id" />
                        </template>
                    </template>
                </template>
                <ol-feature>
                    <ol-geom-point :coordinates="[centerX, centerY]"></ol-geom-point>
                    <ol-style>
                        <ol-style-icon src="/flag.svg" :anchor="[0.5, 1]"></ol-style-icon>
                    </ol-style>
                </ol-feature>
            </ol-source-vector>
        </ol-vector-layer>
    </ol-map>
</template>

<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>