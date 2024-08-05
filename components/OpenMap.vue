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

const convertCoordinates = (coordinates: number[]) => {
    const top = 28.667821
    const bottom = 28.64195
    const right = 115.814312
    const left = 115.789364
    const blank = 27.8
    const unitY = (top - bottom) / 256
    const unitX = (right - left) / (228 - blank)
    return [(coordinates[0] - left) / unitX + blank, (coordinates[1] - bottom) / unitY]
}

const marks = ref({
    '教学楼': [
        {
            name: '慧源楼',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '信工楼',
            coordinates: [115.797684, 28.658021],
            priority: 1
        },
        {
            name: '文法楼',
            coordinates: [115.804576, 28.660339],
            priority: 6
        },
        {
            name: '智华楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        },
        {
            name: '理生楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        },
        {
            name: '基础实验大楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        },
        {
            name: '艺术楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        },
        {
            name: '建工楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        },
        {
            name: '外经楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        },
        {
            name: '环境楼',
            coordinates: [115.804362, 28.663298],
            priority: 6
        }
    ],
    '体育场所': [
        {
            name: '体育馆',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '羽毛球/网球馆',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '游泳馆',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '白帆运动场',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '修贤运动场​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '天健运动场',
            coordinates: [115.804362, 28.663298],
            priority: 1
        }
    ],
    '生活': [
        {
            name: '校医院​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '修贤快递点​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '天健快递点​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '一二食堂​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '三四食堂​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '六七食堂​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '九十食堂​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '修贤宿舍​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '天健宿舍​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '慧源宿舍​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        }
    ],
    '自然景观': [
        {
            name: '先骕园​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '孔雀园​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '正气广场​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '树人广场​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        }
    ],
    '其他': [
        {
            name: '图书馆​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '音乐厅​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '一号门​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '二号门​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '三号门​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
        {
            name: '四号门​',
            coordinates: [115.804362, 28.663298],
            priority: 1
        },
    ]
})

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
                <template v-for="mark in marks.教学楼" >
                    <MapMark v-if="mark.priority < currentZoom" :coordinates="convertCoordinates(mark.coordinates)" :name="mark.name" />
                </template>
            </ol-source-vector>
        </ol-vector-layer>
    </ol-map>
</template>

<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>