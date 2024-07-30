<script setup lang="ts">
const props = defineProps<{
    coordinates: (number | undefined)[]
}>()
</script>

<template>
    <ol-feature>
        <ol-geom-point :coordinates="props.coordinates"></ol-geom-point>
        <ol-style>
            <ol-style-icon src="/餐厅.svg"></ol-style-icon>
        </ol-style>
    </ol-feature>
</template>