<template>
  <div>
    <uploader
      url="http://cn.ynhdkc.com/admin/uploadapiv2/uploadpics"
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
