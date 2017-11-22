// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

import uploader from './uploader'

Vue.use(Vuex)

Vue.use(uploader.plugin)

Vue.config.productionTip = false

let store = new Vuex.Store({})

store.registerModule('imgstore', uploader.store)

/* eslint-disable no-new */
let vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

window.vue = vue
console.log(vue)
