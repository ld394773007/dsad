<template>
  <div id="app" class="m_view">
    <transition :name="direction">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    this.$axios.defaults.headers = {
      Authorization: 'Bearer G6H-mT8S9Cif_ceEUAwyga2EQLXMU1Zl'
    }
  },
  computed: {
    direction () {
      return this.$store.state.direction
    }
  }
}
</script>
