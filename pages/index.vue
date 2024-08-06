<template>
    <v-tabs v-model="map.currentCategory" bg-color="primary" grow center-active @update:model-value="showBottomSheet"
        v-if="map != null" style="position: absolute;z-index: 9999;width: 100%;">
        <v-tab v-for="(category, index) in map.categories" :value="index">{{ category }}</v-tab>
    </v-tabs>
    <div class="map-view" :class="{ 'half': isCategoriesSheetShow }">
        <ClientOnly>
            <OpenMap ref="map" :x="location.x" :y="location.y" />
            <template #fallback> Loading map... </template>
        </ClientOnly>
    </div>
    <v-bottom-sheet v-model="isCategoriesSheetShow" :opacity="0" contained height="50vh">
        <v-card variant="flat" min-height="50vh">
            <v-list :items="map.marks[map.categories[map.currentCategory]]" item-title="name" item-value="id"
                v-model:selected="bottomSheetSelected" @click:select="bottomSheetSelect">
                <v-list-item v-for="(item, index) in map.marks[map.categories[map.currentCategory]]" :key="index"
                    :title="item.name" :active="index === bottomSheetSelected"
                    @click="bottomSheetSelect(index)"></v-list-item>
            </v-list>
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
    bottomSheetSelected.value = 0
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
</style>