<script setup lang="ts">
const route = useRoute()
const id = <any>route.params.id
const currentBuilding = ref<any>(null)
const token = useState('token', () => route.query.token)
const baseURL = useState('baseURL', () => 'https://ncumap-be.ncuos.com')

onMounted(async () => {
    try {
        currentBuilding.value = await $fetch(baseURL.value + `/api/v1/campus/locations/id?location_id=${id}`,{
            headers: {
                Authorization: 'passport ' + token.value
            }
        })
    } catch (err) {
        alert(err)
    }
})
</script>

<template>
    <BackButton></BackButton>
    <v-card v-if="currentBuilding != null" variant="flat" color="#F2F8FA" min-height="100vh">
        <v-img gradient="to top, #F2F8FA 0, transparent 50%, transparent 50%" class="align-end" height="296"
            :src="currentBuilding.cover ? currentBuilding.cover : '/map-cut.png'" cover>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
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
                    <p v-for="content in tip.content" v-html="content"></p>
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
            <v-card-text v-if="currentBuilding.functions">
                <p v-for="f in currentBuilding.functions">
                    {{ f }}
                </p>
            </v-card-text>
            <v-card-text v-else>
                暂无
            </v-card-text>
            <v-card v-for="tip in currentBuilding.tips.functions">
                <v-card-title>
                    <h5>
                        {{ tip.title }}
                    </h5>
                </v-card-title>
                <v-card-text>
                    <p v-for="content in tip.content" v-html="content"></p>
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
            <v-card-text v-if="currentBuilding.offices">
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
                    <p v-for="content in tip.content" v-html="content"></p>
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
            <v-card-text v-if="currentBuilding.activities">
                <p v-for="f in currentBuilding.activities">
                    {{ f }}
                </p>
            </v-card-text>
            <v-card-text v-else>
                暂无
            </v-card-text>
            <v-card v-for="tip in currentBuilding.tips.activities">
                <v-card-title>
                    <h5>
                        {{ tip.title }}
                    </h5>
                </v-card-title>
                <v-card-text>
                    <p v-for="content in tip.content" v-html="content"></p>
                </v-card-text>
            </v-card>
        </v-card>
        <v-card class="content-card" variant="flat" v-if="currentBuilding.imgs">
            <v-img v-for="img in currentBuilding.imgs" :src="img" style="margin: 10px;" />
        </v-card>
        <v-card-text style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
            进入<a href="https://aiguide.ncuos.com/welcome" target="_blank">漫游指北</a>了解更多
        </v-card-text>
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