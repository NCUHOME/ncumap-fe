<script setup lang="ts">
const props = defineProps<{
    name: string,
    coordinates: (number | undefined)[],
}>()

const properties = ref({
    name: '餐厅'
})
</script>

<template>
    <ol-feature :properties="properties">
        <ol-geom-point :coordinates="props.coordinates"></ol-geom-point>
        <ol-style>
            <ol-style-icon src="/餐厅.svg" :anchor="[0.5,1]"></ol-style-icon>
        </ol-style>
    </ol-feature>
</template>