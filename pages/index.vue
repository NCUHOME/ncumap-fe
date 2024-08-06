<template>
    <div style="height: 100%;width: 100%;position: absolute;">
        <ClientOnly>
            <OpenMap ref="map" :x="location.x" :y="location.y" />
            <template #fallback> Loading map... </template>
        </ClientOnly>
    </div>
    <div class="overlay" v-if="map != null">
        <v-tabs v-model="map.currentCategory" bg-color="primary" style="width: 100%;" center-active>
            <v-tab v-for="(category, index) in map.categories" :value="index">{{ category }}</v-tab>
        </v-tabs>
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
    margin-top: 10px;
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
    width: 100%;
}
</style>