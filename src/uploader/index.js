
import uploader from './uploader'
import store from './store'

let plugin = {}

plugin.install = function (_Vue, _store) {
  _Vue.component('uploader', uploader)
  _store.registerModule('imgstore', store)
}

export default plugin
