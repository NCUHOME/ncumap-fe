// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  ssr: false,
  generate: {
    routes: ['/教学楼/0','/教学楼/1','/教学楼/2','/教学楼/3']
  },

  modules: ["vuetify-nuxt-module", "@ant-design-vue/nuxt"]
})