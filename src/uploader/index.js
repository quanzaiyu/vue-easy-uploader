
import uploader from './uploader'
import store from './store'

let plugin = {}

plugin.install = function (_Vue) {
  _Vue.component('uploader', uploader)
}

let index = {
  plugin,
  store
}

export default index
