<template>
  <label class="y_input_wrapper">
    <input class="y_input" type="text" v-model="value" :placeholder="placeholder" />
    <span class="y_input_label">{{label}}</span>
    <i class="y_input_line"></i>
  </label>
</template>
<script>
export default {
  name: 'YInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: 'label'
    },
    placeholder: {
      type: String,
      default: 'placeholder'
    }
  },
  watch: {
    value (value) {
      this.$emit('input', value)
    }
  }
}
</script>
<style lang="scss" scoped>

.y_input_wrapper {
  box-sizing: border-box;
  position: relative;
  display: block;
  padding: 15px 0;
  margin-top: 15px;
  width: 100%;
}

.y_input_label {
  position: absolute;
  top: 0;
  left: 0;
  color: #ADADBD;
  transition: all .3s;
}

.y_input_line {
  position: absolute;
  width: 100%;
  bottom: 0;
  border-top: 1px #34A9FF solid;
  transition: all .3s;
  transform: scale(0)
}

.y_input {
  position: relative;
  box-sizing: border-box;
  margin-right: 10px;
  padding: 11px 5px;
  width: 100%;
  border: none;
  border-bottom: 2px #E5E5EE solid;
  background-color: transparent;
  &:focus + .y_input_label + .y_input_line {
    transform: scale(1)
  }
  &:focus + .y_input_label {
    color: #34A9FF;
  }
}


</style>


