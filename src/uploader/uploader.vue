<template>
  <div class="imgUploader">
    <div class="file-list">
      <section
        v-for="(file, index) in imgStore" :key="index"
        class="file-item draggable-item"
      >
        <img :src="file.src" alt="" ondragstart="return false;">
        <span class="file-remove" @click="remove(index)">+</span>
        <span class="flie-loading" v-if="imgStatus==='uploading'">上传中...</span>
        <span class="flie-finished" v-if="imgStatus==='finished'">已上传</span>
      </section>
      <section class="file-item" v-if="imgStatus !== 'finished' && imgStore.length < 5">
        <div class="add">
          <span><i class="fa fa-camera"></i></span>
          <!-- accept="image/jpeg,image/png" capture="camera" -->
          <input type="file" multiple accept="image/*"
            @change="selectImgs" ref="file"
          >
        </div>
      </section>
    </div>
    <div class="uploadBtn">
      <section>
        <span v-if="imgStore.length > 0" class="empty"
          @click="empty">
            {{imgStatus === 'finished' ? '重新上传' : '清空'}}
        </span>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['url'],
  data () {
    return {
      files: [], // 文件缓存
      index: 0, // 序列号
      maxLength: 5 // 图片最大数量
    }
  },
  computed: {
    ...mapState({
      imgStore: state => state.imgstore.img_upload_cache.slice(0, 5),
      imgPaths: state => state.imgstore.img_paths,
      imgStatus: state => state.imgstore.img_status
    })
  },
  methods: {
    // 选择图片
    selectImgs () {
      let fileList = this.$refs.file.files
      for (let i = 0, len = fileList.length; i < len; i++) {
        let item = {
          key: this.index++,
          name: fileList[i].name,
          size: fileList[i].size,
          file: fileList[i]
        }
        // 将图片文件转成BASE64格式
        let reader = new FileReader()
        reader.onload = (e) => {
          this.$set(item, 'src', e.target.result)
        }
        reader.readAsDataURL(fileList[i])
        this.files.push(item)
      }
      this.files.splice(5)
      this.$store.commit('set_img_upload_cache', this.files.slice(0, 5)) // 存储文件缓存
      this.$store.commit('set_img_status', 'selected') // 更新文件上传状态
    },
    // 上传图片
    submit () {
      let formData = new FormData()
      this.imgStore.forEach((item, index) => {
        item.name = 'imgFiles[' + index + ']'
        formData.append(item.name, item.file)
      })
      // 新建请求
      const xhr = new XMLHttpRequest()
      xhr.open('POST', this.url, true)
      xhr.send(formData)
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 304) {
          let datas = JSON.parse(xhr.responseText)
          console.log('response: ', datas)
          // 存储返回的地址
          let imgUrlPaths = []
          datas.forEach(e => { // error === 0为成功状态
            e.error === 0 && imgUrlPaths.push(e.url)
          })
          this.$store.commit('set_img_paths', imgUrlPaths) // 存储返回的地址
          this.files = [] // 清空文件缓存
          this.index = 0 // 初始化序列号
          this.$store.commit('set_img_status', 'finished') // 更新文件上传状态
        } else {
          this.$toast(`${xhr.status} 请求错误!`)
        }
      }
    },
    // 移除图片
    remove (index) {
      this.files.splice(index, 1)
      this.$store.commit('set_img_upload_cache', this.files) // 更新存储文件缓存
    },
    // 清空图片
    empty () {
      this.files.splice(0, this.files.length)
      this.$store.commit('set_img_upload_cache', this.files) // 更新存储文件缓存
      this.$store.commit('set_img_paths', [])
    }
  },
  beforeCreate () {
    this.$store.commit('set_img_status', 'ready') // 更新文件上传状态
  },
  destroyed () {
    this.$store.commit('set_img_upload_cache', [])
    this.$store.commit('set_img_paths', [])
  },
  watch: {
    imgStatus () {
      if (this.imgStatus === 'uploading') {
        this.submit()
      }
    },
    imgStore () {
      if (this.imgStore.length <= 0) {
        this.$store.commit('set_img_status', 'ready') // 更新文件上传状态
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/base.less';
.imgUploader  {
  margin: 1em 0 2em;
  border: 1px solid #e5e5e5;
  .file-list {
    padding: 10px 0px;
    &::after {
      content: '';
      display: block;
      clear: both;
      visibility: hidden;
      line-height: 0;
      height: 0;
      font-size: 0;
    }
    .file-item {
      float: left;
      position: relative;
      width: 100px;
      text-align: center;
      img {
        width: 80px;
        height: 80px;
        border: 1px solid #ececec;
      }
      .file-remove {
        position: absolute;
        right: 12px;
        top: 4px;
        width: 14px;
        height: 14px;
        color: white;
        cursor: pointer;
        line-height: 12px;
        border-radius: 100%;
        transform: rotate(45deg);
        background: rgba(0, 0, 0, 0.5);
      }
      .flie-loading {
        position: absolute;
        left: 0;
        right: 0;
        top: 1em;
        color: #fff;
        background-color: rgba(0,0,0,.5);
      }
      .flie-finished {
        position: absolute;
        left: 0;
        right: 0;
        top: 1em;
        color: #fff;
        background-color: rgba(0,0,0,.5);
      }
      &:hover .file-remove {
        display: inline;
      }
      .file-name {
        margin: 0;
        height: 40px;
        word-break: break-all;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .add {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 80px;
    font-size: 30px;
    cursor: pointer;
    border: 1px dashed @bd_color;
    color: @sub_color;
    position: relative;  
    background: @bd_color;
    .fa {
      font-size: 1.4em;
      color: #7DD2D9;
    }
  }
  .uploadBtn {
    position: relative;
    .empty {
      position: absolute;
      right: 0;
      bottom: 0;
      background-color: @main_color;
      color: #fff;
      padding: .2em 1em;
    }
  }
}
input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  border: 1px solid #000;
  opacity: 0;
}
</style>
