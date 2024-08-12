<template>
    <a-tabs v-model:activeKey="map.currentCategory" v-if="map != null"
        style="position: absolute;z-index: 9999;background-color: white;width: 100%;" @tab-click="showBottomSheet">
        <a-tab-pane v-for="(category, index) in map.categories" :key="index" :tab="category"></a-tab-pane>
    </a-tabs>
    <div class="map-view" :class="{ 'half': isCategoriesSheetShow }">
        <ClientOnly>
            <OpenMap ref="map" :x="location.x" :y="location.y" />
            <template #fallback> 加载中... </template>
        </ClientOnly>
    </div>
    <v-bottom-sheet v-model="isCategoriesSheetShow" :opacity="0" contained height="50vh">
        <v-card height="100%" style="display: flex;flex-direction: column;justify-content: space-between;">
            <v-list :items="map.marks[map.categories[map.currentCategory]]" item-title="name" item-value="id"
                v-model:selected="bottomSheetSelected" @click:select="bottomSheetSelect">
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
                    style="display: flex;flex-direction: column;align-items: center;font-size: 13px;color: #8F9DB2;"
                    title="进入漫游指北了解更多"></v-list-item>
            </v-list>

            <v-card-actions style="display: flex;flex-direction: row;justify-content: space-around;">
                <a-button block @click="isCategoriesSheetShow = false">取消</a-button>
                <a-button block type="primary"
                    @click="$router.push(`/${map.categories[map.currentCategory]}/${bottomSheetSelected}`)"
                    :disabled="bottomSheetSelected == -1">确认</a-button>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
    <div class="overlay" v-if="map != null">
        <div class="actions">
            <div>
                <v-btn :rounded="0" stacked flat min-width="0" width="44px" height="50px" style="padding: 0;">
                    <img src="/icons/新生手册.svg" />
                    手册
                </v-btn>
            </div>
            <div>
                <v-btn :rounded="0" stacked flat min-width="0" width="44px" height="50px" style="padding: 0;">
                    <img src="/icons/校车.svg" />
                    校车
                </v-btn>
            </div>
            <div>
                <v-btn :rounded="0" stacked flat min-width="0" width="44px" height="50px" style="padding: 0;">
                    <img src="/icons/定位.svg" />
                    定位
                </v-btn>
            </div>
        </div>
        <p>{{ map.currentZoom }}</p>
        <p>{{ map.currentCenter }}</p>
        <p>{{ map.categories }}</p>
        <p>{{ map.currentCategory }}</p>
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

const bottomSheetSelected = ref(0)
const isCategoriesSheetShow = ref(false)
const showBottomSheet = (currentCategory) => {
    bottomSheetSelected.value = -1
    if (currentCategory == 0) {
        isCategoriesSheetShow.value = false
    }
    else {
        isCategoriesSheetShow.value = true
    }
}
const bottomSheetSelect = (index) => {
    bottomSheetSelected.value = index
    if (bottomSheetSelected.value.length != 0) {
        map.value.viewTo(map.value.marks[map.value.categories[map.value.currentCategory]][bottomSheetSelected.value].coordinates)
        const markZoom = map.value.marks[map.value.categories[map.value.currentCategory]][bottomSheetSelected.value].priority
        map.value.zoomTo(3 > markZoom ? 3 : markZoom)
    }
}

if (route.query.x && route.query.y) {
    location.value.x = parseInt(route.query.x);
    location.value.y = parseInt(route.query.y);
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
}
</style>