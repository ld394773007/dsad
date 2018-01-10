<template>
  <div class="m_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="handlerClickLeft">
      <span slot="title">课程大纲</span>
    </van-nav-bar>
    <srcoll :data="data" class="m_body" style="background-color: #fff;">
      <div class="m_tab_content">
        <ul class="content">
          <li :key="item.id" v-for="(item, index) in data">
            <p><i>{{index + 1}}.</i>{{item.name}}</p>
            <span>{{formatTime(item.start_time)}}</span>
          </li>
        </ul>
      </div>
    </srcoll>
  </div>
</template>

<script>
  import {formatTime} from '@/common/js/utils'
  export default {
    name: 'outline',
    props: ['data'],
    components: {
      srcoll: () => import('@/components/srcoll')
    },
    methods: {
      formatTime (t) {
        let time = formatTime(new Date(t * 1000), 'YYYY-MM-DD HH:mm').split(' ')
        let time1 = time[0].split('-')
        return `${time1[0]}年${time1[1]}月${time1[2]}日 ${time[1]}`
      },
      handlerClickLeft () {
        this.$emit('close')
      }
    }
  }
</script>
