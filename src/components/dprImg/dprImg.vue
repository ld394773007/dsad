<template>
  <img :src="path">
</template>
<script>
export default {
  name: 'dprImg',
  props: {
    src: {
      type: String,
      default: '',
      required: true
    },
    src_3x: {
      type: String,
      default: ''
    }
  },
  computed: {
    path () {
      const {src} = this
      const dpr = window.devicePixelRatio
      const fileName = src.substring(src.lastIndexOf('/'), src.lastIndexOf('.'))
      if (dpr === 2) {
        return src.replace(fileName, fileName + '@2x')
      } else if (dpr === 3) {
        return src.replace(fileName, fileName + '@3x')
      } else {
        return src.replace(fileName, fileName + '@2x')
      }
    }
  }
}
</script>

