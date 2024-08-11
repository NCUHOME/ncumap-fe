<script setup lang="ts">
const route = useRoute()
const buildings = ref<any>(null)
const category = <any>route.params.category
const id = <any>route.params.id
const currentBuilding = ref<any>(null)

onMounted(async () => {
    try {
        buildings.value = await $fetch('/data.json')
        currentBuilding.value = buildings.value[category][id]
    } catch (err) {
        alert(err)
    }
})
</script>

<template>
    <v-btn icon width="45px" height="45px" color="rgba(255,255,255,0)"
        style="position: fixed;z-index: 9999;top: 40px;left: 19px;" variant="flat" @click="$router.back()">
        <v-img src="/back.svg" width="auto"></v-img>
    </v-btn>
    <v-card v-if="currentBuilding != null" variant="flat" color="#F2F8FA" min-height="100vh">
        <v-img gradient="to top, #F2F8FA 0, transparent 50%, transparent 50%" class="align-end" height="296"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover>
            <v-card-title style="font-size: 32px;color: #164CD7;">{{ currentBuilding.name }}</v-card-title>
        </v-img>
        <v-card-text style="color: #3A5A8A;">
            {{ currentBuilding.info }}
            <v-card v-for="tip in currentBuilding.tips.info">
                <v-card-title>
                    <h5>
                        {{ tip.title }}
                    </h5>
                </v-card-title>
                <v-card-text>
                    <p v-for="content in tip.content">
                        {{ content }}
                    </p>
                </v-card-text>
            </v-card>
        </v-card-text>
        <v-card class="content-card" variant="flat">
            <v-card-item>
                <template v-slot:prepend>
                    <v-img width="auto" src="/icons/基本职能.svg"></v-img>
                </template>
                <v-card-title style="color: #123871;">基本职能</v-card-title>
            </v-card-item>
            <v-card-text>
                <p v-for="f in currentBuilding.functions">
                    {{ f }}
                </p>
            </v-card-text>
            <v-card v-for="tip in currentBuilding.tips.functions">
                <v-card-title>
                    <h5>
                        {{ tip.title }}
                    </h5>
                </v-card-title>
                <v-card-text>
                    <p v-for="content in tip.content">
                        {{ content }}
                    </p>
                </v-card-text>
            </v-card>
        </v-card>
        <v-card class="content-card" variant="flat">
            <v-card-item>
                <template v-slot:prepend>
                    <v-img width="auto" src="/icons/学院办公点.svg"></v-img>
                </template>
                <v-card-title style="color: #123871;">学院办公点</v-card-title>
            </v-card-item>
            <v-card-text v-if="currentBuilding.offices.length > 0">
                <p v-for="f in currentBuilding.offices">
                    {{ f }}
                </p>
            </v-card-text>
            <v-card-text v-else>
                暂无
            </v-card-text>
            <v-card v-for="tip in currentBuilding.tips.offices">
                <v-card-title>
                    <h5>
                        {{ tip.title }}
                    </h5>
                </v-card-title>
                <v-card-text>
                    <p v-for="content in tip.content">
                        {{ content }}
                    </p>
                </v-card-text>
            </v-card>
        </v-card>
        <v-card class="content-card" variant="flat">
            <v-card-item>
                <template v-slot:prepend>
                    <v-img width="auto" src="/icons/其他.svg"></v-img>
                </template>
                <v-card-title style="color: #123871;">其他</v-card-title>
            </v-card-item>
            <v-card-text>
                <p v-for="f in currentBuilding.activities">
                    {{ f }}
                </p>
            </v-card-text>
            <v-card v-for="tip in currentBuilding.tips.activities">
                <v-card-title>
                    <h5>
                        {{ tip.title }}
                    </h5>
                </v-card-title>
                <v-card-text>
                    <p v-for="content in tip.content">
                        {{ content }}
                    </p>
                </v-card-text>
            </v-card>
        </v-card>
    </v-card>
</template>

<style scoped>
p {
    margin-top: 10px;
}
.content-card {
    margin: 10px;
}
</style>