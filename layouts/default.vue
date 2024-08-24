<template>
    <v-app>
        <v-main :style="{ marginTop: `${marginTop}px` }">
            <slot />
        </v-main>
    </v-app>
</template>

<script setup>
import { mincu } from 'mincu-vanilla';

const marginTop = ref(0);

onMounted(() => {
  marginTop.value = mincu.inset.top;
  mincu.setBarStyle("dark-content")
});
</script>