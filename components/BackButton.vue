<template>
    <v-btn icon width="45px" height="45px" color="rgba(255,255,255,0)"
        :style="{ position: `fixed`,zIndex: 9999,top: `${40 + marginTop}px`,left: `19px` }" variant="flat" @click="$router.back()">
        <v-img src="/back.svg" width="auto"></v-img>
    </v-btn>
</template>         

<script setup>
import { mincu } from 'mincu-vanilla';

const marginTop = ref(0);

onMounted(() => {
  marginTop.value = mincu.inset.top;
});
</script>