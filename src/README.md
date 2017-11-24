# vue-easy-uploader

<p align="center">
  <a href="https://www.npmjs.com/package/vue-easy-uploader"><img src="https://img.shields.io/npm/v/vue-easy-uploader.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-easy-uploader"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
</p>

> 一个基于Vue的多文件上传插件，目前支持常见图片的上传，后续版本会加入其他文件的支持。



### 安装

```bash
npm i vue-easy-uploader --save
```



### 使用

在入口文件`main.js`中加入以下代码:

```js
import App from './App'
import Vuex from 'vuex'
import uploader from 'vue-easy-uploader'

let store = new Vuex.Store({})
Vue.use(uploader, store)
```

插件内部设置了状态管理，因此需要vuex的支持。



### 在Vue组件中使用

```html
<uploader
	url="http://..."
></uploader>
```

#### 参数说明:

```
url: 上传接口路径
```

需要与后端约定上传格式，使用表单提交方式，后端需获取`input[type='file']`的`name`属性，默认为`name="imgFiles[0]"`、`name="imgFiles[1]"` ...数组序号从0递增。

![](https://raw.githubusercontent.com/quanzaiyu/vue-easy-uploader/master/static/03.png)



![](https://raw.githubusercontent.com/quanzaiyu/vue-easy-uploader/master/static/02.png)





![](https://raw.githubusercontent.com/quanzaiyu/vue-easy-uploader/master/static/01.png)



示例代码:

```vue
<template>
  <div>
    <uploader
      url="http://..."
    ></uploader>
    <div class="btn" @click="upload">
      上传
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      imgs: []
    }
  },
  computed: {
    ...mapState({
      imgStatus: state => state.imgstore.img_status,
      imgPaths: state => state.imgstore.img_paths
    })
  },
  methods: {
    upload () {
      this.$store.commit('set_img_status', 'uploading')
    },
    submit () {
      let values = []
      for (let key of this.imgPaths) {
        values.push(key)
      }
      this.imgs = values
      console.log(this.imgs)
    }
  },
  watch: {
    imgStatus () {
      if (this.imgStatus === 'finished') {
        this.submit()
      }
    }
  },
  destoryed () {
    this.imgs = []
  }
}
</script>

<style scoped lang="less">
.btn {
  width: 100%;
  height: 3em;
  background-color: green;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
```

状态管理中包括

```json
state.imgstore.img_upload_cache # 上传文件缓存
state.imgstore.img_status # 上传状态，包括 ready selected uploading finished
state.imgstore.img_paths # 上传后的路径反馈
```







详细的示例可访问本项目的 [GitHub地址](https://github.com/quanzaiyu/vue-easy-uploader) 。

