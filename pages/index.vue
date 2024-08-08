<template>
    <a-tabs v-model:activeKey="map.currentCategory" v-if="map != null"
        style="position: absolute;z-index: 9999;background-color: white;width: 100%;" @tab-click="showBottomSheet">
        <a-tab-pane v-for="(category, index) in map.categories" :key="index" :tab="category"></a-tab-pane>
    </a-tabs>
    <div class="map-view" :class="{ 'half': isCategoriesSheetShow }">
        <ClientOnly>
            <OpenMap ref="map" :x="location.x" :y="location.y" />
            <template #fallback> Loading map... </template>
        </ClientOnly>
    </div>
    <v-bottom-sheet v-model="isCategoriesSheetShow" :opacity="0" contained height="50vh">
        <v-card height="100%">
            <v-list :items="map.marks[map.categories[map.currentCategory]]" item-title="name" item-value="id"
                v-model:selected="bottomSheetSelected" @click:select="bottomSheetSelect">
                <v-list-item v-for="(item, index) in map.marks[map.categories[map.currentCategory]]" :key="index"
                    :title="item.name" :active="index === bottomSheetSelected" @click="bottomSheetSelect(index)"
                    rounded="xl"></v-list-item>
            </v-list>
            <v-main>
                进入漫游指北了解更多
            </v-main>
            <v-card-actions style="display: flex;flex-direction: row;justify-content: space-around;">
                <a-button type="primary" :disabled="bottomSheetSelected == -1">Primary Button</a-button>
                <a-button>Default Button</a-button>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
    <div class="overlay" v-if="map != null">
        <div class="actions">
            <div>
                <v-btn :rounded="0">
                    <v-img width="auto" src="/icons/新生手册.svg" />
                </v-btn>
                <p>新生手册</p>
            </div>
            <div>
                <v-btn :rounded="0">
                    <v-img width="auto" src="/icons/校车.svg" />
                </v-btn>
                <p>校车</p>
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
        map.value.zoomTo(3)
    }
}

if (route.query.x && route.query.y) {
    location.value.x = parseInt(route.query.x);
    location.value.y = parseInt(route.query.y);
}
</script>

<style scoped>
.v-btn {
    min-width: 0;
    padding: 0;
}

.v-btn.v-btn--density-default {
    height: fit-content;
}

.actions {
    margin-top: 100px;
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
</style>