<template>
  <transition :name="direction">
    <router-view/>
  </transition>
</template>

<script>
export default {
  name: 'home_index',
  computed: {
    direction () {
      return this.$store.state.direction
    }
  }
}
</script>
