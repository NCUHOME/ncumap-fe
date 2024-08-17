<script setup lang="ts">
const route = useRoute()
const id = <any>route.params.id
const currentActivity = ref<any>(null)
const location = ref(null)
const token = useState('token', () => route.query.token)
const baseURL = useState('baseURL', () => 'https://ncumap-be.ncuos.com')

onMounted(async () => {
    try {
        currentActivity.value = await $fetch(baseURL.value + `/api/v1/activity/id?id=${id}`, {
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
    <v-card v-if="currentActivity != null" variant="flat" color="#F2F8FA" min-height="100vh">
        <v-img gradient="to top, #F2F8FA 0, transparent 50%, transparent 50%" class="align-end" height="296"
            :src="currentActivity.image ? currentActivity.image : '/map-cut.png'" cover>
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                </div>
            </template>
            <v-card-title style="font-size: 32px;color: #164CD7;">{{ currentActivity.name }}</v-card-title>
        </v-img>
        <v-card-text style="color: #3A5A8A;">
            {{ currentActivity.info }}
        </v-card-text>
        <v-card class="content-card" variant="flat">
            <v-card-item>
                <template v-slot:prepend>
                    <v-img width="auto" src="/icons/活动内容.svg"></v-img>
                </template>
                <v-card-title style="color: #123871;">活动内容</v-card-title>
            </v-card-item>
            <v-card-text v-if="currentActivity.content">
                {{ currentActivity.content }}
            </v-card-text>
            <v-card-text v-else>
                暂无
            </v-card-text>
        </v-card>
        <v-card class="content-card" variant="flat">
            <v-card-item>
                <template v-slot:prepend>
                    <v-img width="auto" src="/icons/活动地点.svg"></v-img>
                </template>
                <v-card-title style="color: #123871;">活动地点</v-card-title>
            </v-card-item>
            <v-card-text v-if="currentActivity.location">
                {{ currentActivity.location }}
            </v-card-text>
            <v-card-text v-else>
                暂无
            </v-card-text>
            <v-card-actions v-if="currentActivity.location_id">
                <a-button block type="primary"
                    @click="$router.push(`/${currentActivity.value.location_id}?token=${token}`)">查看地点详情</a-button>
            </v-card-actions>
        </v-card>
        <v-card class="content-card" variant="flat">
            <v-card-item>
                <template v-slot:prepend>
                    <v-img width="auto" src="/icons/活动时间.svg"></v-img>
                </template>
                <v-card-title style="color: #123871;">活动时间</v-card-title>
            </v-card-item>
            <v-card-text v-if="currentActivity.time_date">
                <p>
                    {{ currentActivity.time_date }}
                </p>
                <p>
                    {{ currentActivity.time_clock }}
                </p>
            </v-card-text>
            <v-card-text v-else>
                暂无
            </v-card-text>
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