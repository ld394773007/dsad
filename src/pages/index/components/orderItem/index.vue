<template>
  <div class="order_content" @click="hanlerClick">
    <div class="order_header">
      <div class="order_name">
        <h2>{{item.product[0].product_name}}</h2>
      </div>
      <i :class="`order_status ${getStatus.type}`">{{getStatus.text}}</i>
    </div>
    <div class="order_body">
      <p class="market_price"><i>¥</i>{{item.product[0].market_price}}</p>
    </div>
    <div class="order_footer">
      <span>{{createdTime}}</span>
      <div class="order_footer_right">
        <p>实付款：</p><p class="red"><i>¥</i>{{item.order_amount}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatTime} from '@/common/js/utils'
  export default {
    name: 'lessonItem',
    props: ['item', 'index'],
    computed: {
      getStatus () {
        let orderStatus = this.item.order_status
        let payStatus = this.item.pay_status

        if (orderStatus < 2 && !payStatus) {
          return {text: '未支付', type: 'wzf'}
        } else if (orderStatus === 2) {
          return {text: '已取消', type: 'yqx'}
        } else if (payStatus === 1) {
          return {text: '已付款', type: 'yfk'}
        }
      },
      createdTime () {
        if (!this.item.created_at) return ''
        return formatTime(new Date(this.item.created_at * 1000), 'YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      formatNum (n) {
        let numList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        return numList[n]
      },
      hanlerClick () {
        this.$emit('hanlerClick', this.item.id)
      }
    }
  }
</script>
<style lang="scss" scoped>
@import '../../assets/scss/variable/index';
.order_content {
  padding: 20px 12px;
  background-color: #fff;
  color: #0B0817;
  margin-bottom: 15px;
}
.order_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .order_name {
    width: 75%;
    height: 60px;
  }
  h2 {
    font-size: 20px;
    width: 100%;
  }
  .order_status {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    background-color: $color_theme;
    color: #fff;
    &.yqx {
      background-color: rgb(224, 224, 224);
      color: #000;
    }
    &.yfk {
      background-color: rgb(8, 214, 101);
    }
  }
}

.order_body {
  margin-top: 1px;
  margin-bottom: 25px;
  .market_price {
    font-size: 20px;
    color: #19191E;
    i {
      margin-right: 5px;
      font-size: 14px;
    }
  }
}

.order_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: #ADADBD;
  }
  .order_footer_right {
    display: flex;
    align-items: center;
    .red {
      margin-left: 10px;
      font-size: 24px;
      color: #F25417;
      font-weight: bold;
      i {
        margin-right: 5px;
        font-size: 14px;
      }
    }
  }
}
</style>

