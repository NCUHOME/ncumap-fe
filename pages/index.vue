<template>
    <!-- 上方选项卡 -->
    <a-tabs v-model:activeKey="map.currentCategory" v-if="map != null"
        style="position: absolute;z-index: 9999;background-color: white;width: 100%;" @tab-click="showBottomSheet" @touchmove.prevent>
        <a-tab-pane v-for="(category, index) in map.categories" :key="index" :tab="category"></a-tab-pane>
    </a-tabs>
    <!-- 主地图 -->
    <div class="map-view" :class="{ 'half': isCategoriesSheetShow || isManualShow }">
        <ClientOnly>
            <OpenMap ref="map" :x="location.x" :y="location.y" />
            <template #fallback>
                <div
                    style="height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;flex-direction: column;">
                    <v-progress-circular indeterminate></v-progress-circular>
                    <p>加载地图中</p>
                </div>
            </template>
        </ClientOnly>
    </div>
    <!-- 建筑选择菜单 -->
    <v-bottom-sheet v-model="isCategoriesSheetShow" :opacity="0" contained height="50vh">
        <v-card height="100%" style="display: flex;flex-direction: column;justify-content: space-between;">
            <v-list :items="map.marks[map.categories[map.currentCategory]]" item-title="name" item-value="id"
                @click:select="bottomSheetSelect">
                <v-list-item v-for="(item, index) in map.marks[map.categories[map.currentCategory]]" :key="index"
                    :active="index === bottomSheetSelected" @click="bottomSheetSelect(index)" rounded="lg"
                    :border="index === bottomSheetSelected ? 'md' : false"
                    style="padding: 10px;border-color: #164CD7 !important;">
                    <v-list-item-title>
                        <div style="display: flex;flex-direction: row;justify-content: space-between;">
                            <span style="font-size: 21px;">{{ item.name }}</span>
                            <img v-if="index === bottomSheetSelected" width="auto" src="/flag.svg">
                        </div>
                    </v-list-item-title>
                    <v-list-item-subtitle style="color: #3A5A8A;font-size: 13px;">
                        {{ item.info }}
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item
                    style="display: flex;flex-direction: column;align-items: center;font-size: 13px;color: #8F9DB2;">
                    <v-list-item-title>
                        进入<a href="https://aiguide.ncuos.com/welcome" target="_blank">漫游指北</a>了解更多
                    </v-list-item-title>
                </v-list-item>
            </v-list>

            <v-card-actions style="display: flex;flex-direction: row;justify-content: space-around;">
                <a-button block @click="isCategoriesSheetShow = false" style="background-color: #F3F6F7;">取消</a-button>
                <a-button block type="primary"
                    @click="$router.push(`/${map.marks[map.categories[map.currentCategory]][bottomSheetSelected].location_id}`)"
                    :disabled="bottomSheetSelected == -1">确认</a-button>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
    <!-- 新生手册 -->
    <v-bottom-sheet v-if="map != null" v-model="isManualShow" :opacity="0" contained height="50vh">
        <v-card height="100%" style="display: flex;flex-direction: column;justify-content: space-between;">
            <v-list open-strategy="single" @click:open="bottomSheetSelected = -1">
                <template v-for="(category, index) in Object.keys(manualData)" :key="index">
                    <v-list-group v-if="manualData[category]" style="color: #476491;font-size: 13px;">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" :title="category">
                                <template v-slot:append="{ isActive }">
                                    <img v-if="isActive" src="/up.svg" />
                                    <img v-else src="/down.svg" />
                                </template>
                            </v-list-item>
                        </template>
                        <v-list-item v-for="(item, itemIndex) in manualData[category]" :key="itemIndex"
                            :active="itemIndex === bottomSheetSelected" @click="manualSelect(itemIndex, index)"
                            rounded="lg" :border="itemIndex === bottomSheetSelected ? 'md' : false"
                            style="padding: 10px;border-color: #164CD7 !important;">
                            <v-list-item-title>
                                <div style="display: flex;flex-direction: row;justify-content: space-between;">
                                    <span style="font-size: 15px;color: black;">{{ item.name }}</span>
                                </div>
                            </v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </template>
                <v-list-item
                    style="display: flex;flex-direction: column;align-items: center;font-size: 13px;color: #8F9DB2;">
                    <v-list-item-title>
                        进入<a href="https://aiguide.ncuos.com/welcome" target="_blank">漫游指北</a>了解更多
                    </v-list-item-title></v-list-item>
            </v-list>
            <v-card-actions style="display: flex;flex-direction: row;justify-content: space-around;">
                <a-button block @click="isManualShow = false" style="background-color: #F3F6F7;">取消</a-button>
                <a-button block type="primary" @click="manualRedirect"
                    :disabled="bottomSheetSelected == -1">确认</a-button>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
    <!-- 活动页面 -->
    <v-bottom-sheet v-model="isActivitiesSheetShow" :opacity="0.3" contained height="70vh">
        <v-card height="100%" style="display: flex;flex-direction: column;justify-content: space-between;">
            <v-list :items="activitiesData"
                v-model:selected="bottomSheetSelected">
                <v-list-item v-for="item in activitiesData" :value="item.id">
                    <v-list-item-title>
                        {{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ item.content }}
                    </v-list-item-subtitle>
                </v-list-item>
                <v-list-item
                    style="display: flex;flex-direction: column;align-items: center;font-size: 13px;color: #8F9DB2;">
                    <v-list-item-title>
                        进入<a href="https://aiguide.ncuos.com/welcome" target="_blank">漫游指北</a>了解更多
                    </v-list-item-title>
                </v-list-item>
            </v-list>

            <v-card-actions style="display: flex;flex-direction: row;justify-content: space-around;">
                <a-button block @click="isActivitiesSheetShow = false" style="background-color: #F3F6F7;">取消</a-button>
                <a-button block type="primary"
                    @click="$router.push(`/activities/${bottomSheetSelected}`)"
                    :disabled="bottomSheetSelected == -1">确认</a-button>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
    <!-- 右侧按钮 -->
    <div class="overlay" v-if="map != null" @touchmove.prevent>
        <div class="actions">
            <div>
                <v-btn :rounded="0" stacked flat min-width="0" width="44px" height="50px" style="padding: 0;"
                    @click="showManual">
                    <img src="/icons/新生手册.svg" />
                    手册
                </v-btn>
            </div>
            <div>
                <v-btn :rounded="0" stacked flat min-width="0" width="44px" height="50px" style="padding: 0;"
                    @click="schoolCarDialog = true">
                    <img src="/icons/校车.svg" />
                    校车
                </v-btn>
            </div>
            <div>
                <v-btn :rounded="0" stacked flat min-width="0" width="44px" height="50px" style="padding: 0;"
                    @click="map.backToCenter()">
                    <img src="/icons/定位.svg" />
                    定位
                </v-btn>
            </div>
        </div>
    </div>
    <!-- 校车 -->
    <v-dialog v-model="schoolCarDialog" width="auto">
        <v-card>
            <v-btn icon width="45px" height="45px" color="rgba(255,255,255,0)"
                style="position: fixed;z-index: 9999;top: 15px;left: 15px;" variant="flat"
                @click="schoolCarDialog = false">
                <v-img src="/back.svg" width="auto">
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                        </div>
                    </template>
                </v-img>
            </v-btn>
            <v-img src="/schoolCar.svg" width="auto"></v-img>
        </v-card>
    </v-dialog>
</template>

<script setup>
import OpenMap from '../components/OpenMap.vue';
import { ref } from 'vue';
import { mincu } from 'mincu-vanilla'
import axios from 'axios'

const fetcher = axios.create()
mincu.useAxiosInterceptors(fetcher)

const route = useRoute()
const map = ref(null)
const location = ref({
    x: 115.804362,
    y: 28.663298
})

const baseURL = useState('baseURL', () => 'https://ncumap-be.ncuos.com')

const activeListGroup = ref(-1)
const bottomSheetSelected = ref(-1)
const isCategoriesSheetShow = ref(false)
const schoolCarDialog = ref(false)
const isManualShow = ref(false)
const manualData = ref(null)
const activitiesData = ref(null)
const isActivitiesSheetShow = ref(false)

onMounted(async () => {
    try {
        await fetcher.get(baseURL.value + "/api/v1/freshmen/manual").then(
            data => data.data
        ).then(
            data => manualData.value = data
        )
       await fetcher.get(baseURL.value + "/api/v1/activity/all").then(
            data => data.data
        ).then(
            data =>  activitiesData.value = data
        )
    } catch (err) {
        alert(err)
    }
})

const showBottomSheet = (currentCategory) => {
    schoolCarDialog.value = false
    bottomSheetSelected.value = -1
    isManualShow.value = false
    if (currentCategory == 0 || currentCategory == 1) {
        isCategoriesSheetShow.value = false
        isActivitiesSheetShow.value = false
        if (currentCategory == 1) {
            isActivitiesSheetShow.value = true
        }
    }
    else {
        isCategoriesSheetShow.value = true
        isActivitiesSheetShow.value = false
    }
}

const showManual = () => {
    bottomSheetSelected.value = -1
    isCategoriesSheetShow.value = false
    isManualShow.value = true
}

const bottomSheetSelect = (index) => {
    bottomSheetSelected.value = index
    map.value.viewTo(map.value.marks[map.value.categories[map.value.currentCategory]][bottomSheetSelected.value].coordinates)
    const markZoom = map.value.marks[map.value.categories[map.value.currentCategory]][bottomSheetSelected.value].priority
    map.value.zoomTo(3 > markZoom ? 3 : markZoom)
}

const manualRedirect = () => {
    const router = useRouter()
    const current = manualData.value[Object.keys(manualData.value)[activeListGroup.value]][bottomSheetSelected.value]
    router.push(`/${current.location_id}`)
}

const manualSelect = (itemIndex, index) => {
    bottomSheetSelected.value = itemIndex
    activeListGroup.value = index
    const current = manualData.value[Object.keys(manualData.value)[activeListGroup.value]][bottomSheetSelected.value]
    map.value.viewTo(current.coordinates)
}

if (route.query.x && route.query.y) {
    location.value.x = parseFloat(route.query.x);
    location.value.y = parseFloat(route.query.y);
}
</script>

<style scoped>
.actions {
    margin-top: 100px;
    background-color: white;
    padding-top: 15px;
    padding-bottom: 15px;
    border-radius: 15px;
    margin-right: 10px;
}

.actions div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.overlay {
    position: absolute;
    right: 0;
    display: flex;
    align-items: end;
    flex-direction: column;
}

.map-view {
    width: 100%;
    height: 100%;
    position: absolute;
}

.half {
    height: 50vh;
}

::v-deep(.ant-tabs-nav) {
    margin: 0 !important;
}

.ant-btn {
    margin: 5px;
    padding: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border-radius: 10px;
    border: 0;
}
</style>