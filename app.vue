<template>
  <NuxtLayout>
    <NuxtPage :keepalive="{}" />
  </NuxtLayout>
</template>

<style>
body {
  margin: 0;
}
</style>

<script setup>
useSeoMeta({
  title: '校园地图',
  description: 'mapping campus, mapping life! ',
  ogTitle: '校园地图',
  ogDescription: 'mapping campus, mapping life! ',
  twitterTitle: '校园地图',
  twitterDescription: 'mapping campus, mapping life! ',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
})
</script>