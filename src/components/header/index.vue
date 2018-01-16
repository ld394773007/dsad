<template>
  <div class="y_header" :class="{'fixed': fixed}">
    <div class="y_header_left" @click="handlerClick(0)">
      <slot name="left"></slot>
    </div>
    <div class="y_header_center">
      <slot></slot>
    </div>
    <div class="y_header_right" @click="handlerClick(1)">
      <slot name="right" ></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'YHeader',
  props: {
    fixed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlerClick (v) {
      if (v === 0) {
        this.$emit('click-left')
      } else {
        this.$emit('click-right')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.y_header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  height: 50px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px #efefef solid;
  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  &_left,
  &_right {
    flex: 1;
    height: 50px;
  }
  &_left {
    display: flex;
    align-items: center;
  }
  &_right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  &_center {
    flex: 6;
    text-align: center;
    font-size: 18px;
  }
}
</style>


