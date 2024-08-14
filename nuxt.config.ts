// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  devServer: {
    host: '192.168.31.243'
  },

  modules: ["vuetify-nuxt-module", "@ant-design-vue/nuxt"]
})