<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    document.getElementById('qdt').setAttribute('class', 'hide')
    let url = window.localStorage.getItem('payUrl')
    if (url) {
      this.$router.push(url)
      window.localStorage.removeItem('payUrl')
    }
  }
}
</script>
