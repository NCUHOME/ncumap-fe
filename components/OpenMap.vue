<script setup lang="ts">
import { ref } from 'vue'
import type { ObjectEvent } from "ol/Object";
import type { View, Feature } from "ol";
import { Style, Icon } from 'ol/style';
import { mincu, uiModule } from 'mincu-vanilla'
import axios from 'axios'
import AMapLoader from '@amap/amap-jsapi-loader';
import { gcj02towgs84 } from '~/utils/gcj02towgs84';

const fetcher = axios.create()
mincu.useAxiosInterceptors(fetcher)

const convertCoordinates = (coordinates: number[]) => {
    const top = 28.66776098033687
    const bottom = 28.641503853212868
    const right = 115.81343996831613
    const left = 115.78972714948839
    const blank = 27.8
    const unitY = (top - bottom) / 256
    const unitX = (right - left) / (256 - 2 * blank)
    return [(coordinates[0] - left) / unitX + blank, (coordinates[1] - bottom) / unitY]
}

const props = defineProps({
    x: Number,
    y: Number
})

let [centerX, centerY] = convertCoordinates([<number>props.x, <number>props.y])

if (centerX > 256) {
    centerX = 256
} else if (centerX < 0) {
    centerX = 0
}

if (centerY > 256) {
    centerY = 256
} else if (centerY < 0) {
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
        router.push(`/${feature.values_.id}`)
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
const baseURL = useState('baseURL')
const geoLocationMark = ref<number[]>([])

const isInSchool = ([x, y]: number[]) => {
    const outterRadius = 327.903773758
    const outterPosition = [358.719676797, 256-267.353227436]
    const innerRadius = 139.212193554
    const innerPosition = [237.606831329, 256-230.578642916]

    const distance = ([x1, y1]: number[], [x2, y2]: number[]) => {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
    }

    return distance([x, y], outterPosition) < outterRadius && distance([x, y], innerPosition) > innerRadius
}

const geoSuccess = (position: any) => {
    let [centerX, centerY] = convertCoordinates(gcj02towgs84(position.lng, position.lat))
    //let [centerX, centerY] = convertCoordinates([115.804362, 28.663298])

    if (centerX > 256) {
        centerX = 256
    } else if (centerX < 0) {
        centerX = 0
    }

    if (centerY > 256) {
        centerY = 256
    } else if (centerY < 0) {
        centerY = 0
    }

    if (isInSchool([centerX, centerY])) {
        geoLocationMark.value = [centerX, centerY]
        center.value = [centerX, centerY]
    } else {
        mincu.toast.info(`位于校外(${gcj02towgs84(position.lng, position.lat)})`)
        viewTo([115.804362, 28.663298])
    }
}

const locate = () => {
    window._AMapSecurityConfig = {
        securityJsCode: "3b0c7a5e50d23895fb666c57276a941e",
    };
    AMapLoader.load({
        key: "9ccb98703bb482fd005469e70f67c640", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.Geolocation'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            AMap.plugin('AMap.Geolocation', function () {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认：true
                    timeout: 10000, // 设置定位超时时间，默认：无穷大
                })

                geolocation.getCurrentPosition(function (status: any, result: any) {
                    if (status == 'complete') {
                        geoSuccess(result.position)
                    } else {
                        console.log(result)
                    }
                });
            })

            //navigator.geolocation.getCurrentPosition(geoSuccess, (error) => alert(error.message), geoOptions)
        })
}
onMounted(async () => {
    try {
        locate()
        await fetcher.get(baseURL.value + '/api/v1/campus/marks').then(
            data => data.data
        ).then(data => {
            marks.value = data
        })
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

const showAllMarks = () => {
    currentCategory.value = 0
}

defineExpose({
    currentZoom,
    currentCenter,
    categories,
    currentCategory,
    marks,
    viewTo,
    zoomTo,
    backToCenter,
    locate,
    showAllMarks
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
                    <template v-if="currentCategory == 0 || currentCategory == 1">
                        <template v-for="category in categories">
                            <template v-for="mark in marks[category]">
                                <MapMark v-if="mark.priority <= currentZoom"
                                    :coordinates="convertCoordinates(mark.coordinates)" :name="mark.name"
                                    :category="category" :id="mark.location_id" />
                            </template>
                        </template>
                    </template>
                    <template v-else>
                        <template v-for="mark in marks[categories[currentCategory]]">
                            <MapMark v-if="mark.priority <= currentZoom"
                                :coordinates="convertCoordinates(mark.coordinates)" :name="mark.name"
                                :category="categories[currentCategory]" :id="mark.location_id" />
                        </template>
                    </template>
                </template>
                <ol-feature v-if="geoLocationMark.length > 0">
                    <ol-geom-point :coordinates="geoLocationMark"></ol-geom-point>
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