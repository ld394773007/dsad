<template>
  <div id="app">
    <router-view/>
    <login v-if="isLogin" @close="close" style="z-index: 98;"></login>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    let url = window.localStorage.getItem('payUrl')
    if (url) {
      this.$router.push(url)
      window.localStorage.removeItem('payUrl')
    }
  },
  methods: {
    close () {
      this.$store.commit('CHANGE_LOGIN_STATUS', false)
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    }
  },
  components: {
    login: () => import('./pages/login')
  }
}
</script>
