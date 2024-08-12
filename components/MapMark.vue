<script setup lang="ts">
const props = defineProps<{
    name: string,
    coordinates: (number | undefined)[],
    category: string,
    id: number
}>()

const properties = ref({
    name: '餐厅',
    category: props.category,
    id: props.id
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