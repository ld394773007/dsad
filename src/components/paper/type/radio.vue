<template>
  <div class="answer">
    <div class="answer-label" v-for="(answer, i) in item.items" v-if="item.type < 5 && item.type != 3" :key="i">
        <label class="answer-content" v-if="item.type == 1">
          <mu-radio :label="`${answer.value}.`" :name="'radio' + index" :nativeValue="answer.key" v-model="item.answer">
            <div slot="label" v-html="`${answer.key}. ${answer.value}`"></div>
          </mu-radio>
        </label>
        <label class="answer-content" v-if="item.type == 2">
          <mu-checkbox  :label="`${answer.key}.`" name="checkbox" :nativeValue="answer.key" v-model="checkbox" />
          <div v-html="answer.value"></div>
        </label>
        <div class="answer-input" v-if="item.type == 4 && !data">
          <mu-text-field hintText="此处填写答案" v-model="input[i]"/>
        </div>
        <div class="answer-input" v-if="item.type == 4 && data">
          <mu-text-field hintText="此处填写答案" v-model="item.answer"/>
        </div>
      </div>
    <div class="answer-label" v-for="(i, index) in 2" v-if="item.type == 3" :key="i">
        <label class="answer-content">
          <mu-radio :label="index ? '正确' : '错误'" :nativeValue="index" v-model="item.answer">

          </mu-radio>
        </label>
      </div>
  </div>
</template>
<script>
import radio from 'muse-components/radio'
import checkbox from 'muse-components/checkbox'
import textField from 'muse-components/textField'
export default {
  props: {
    data: {
      type: [Object, Boolean],
      default: false
    },
    item: {
      type: Object,
      default: {}
    },
    index: {
      type: [Number, String],
      default: 0
    }
  },
  created () {
    if (this.item.type === 4) {
      if (this.item.answer) {
        this.input = this.item.answer.split(',')
      }
    }
    if (this.item.type === 2) {
      if (this.item.answer) {
        this.checkbox = this.item.answer.split(',')
      }
    }
  },
  watch: {
    input (n, o) {
      this.item.answer = n.join()
    },
    checkbox (n, o) {
      this.item.answer = n.join(',')
      console.log(this.item)
    }
  },
  data () {
    return {
      input: [],
      checkbox: []
    }
  },
  components: {
    [radio.name]: radio,
    [checkbox.name]: checkbox,
    [textField.name]: textField
  }
}
</script>
