<template>
  <div class="m_wrap" style="z-index: 999;">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
      <span slot="title">订单详情</span>
    </van-nav-bar>
    <div class="m_body">
      <div class="order-item">
        <div class="order-item-head">
          <p>{{foramtTime1(item.created_at, 'YYYY-MM-DD')}}</p>
          <span>{{getStatus()}}</span>
        </div>
        <div class="order-item-body">
          <div class="order-item-img">
            <img :src="item.product[0].thumb">
          </div>
          <div class="order-item-info">
            <div>
              <p>{{item.product[0].product_name}}</p>
            </div>
            <span>¥ {{toDecimal2(getNum(item.order_amount))}}</span>
          </div>
        </div>
      </div>
      <div class="order-detail-1">
        <div class="order-detail-price">
          <p><span>课程总价</span><span>¥ {{goodAmount}}</span></p>
          <p><span>优惠</span><span>¥ {{couponAmount}}</span></p>
        </div>
        <div class="order-item-foot order-detail-foot">
          <a @click="deleteOrder" v-if="item.order_status == 2">删除订单</a>
          <a @click="cancelOrder" v-if="!item.pay_status && item.order_status < 2">取消订单</a>
          <a @click="payOrder" class="payment" v-if="!item.pay_status && item.order_status < 2">去支付</a>
          <p v-if="item.pay_status == 1"><span>实付款</span>￥{{toDecimal2(getNum(item.order_amount))}}</p>
        </div>
      </div>
      <div class="order-detail-2">
        <p>订单编号：{{item.order_sn}}</p>
        <p v-if="item.pay_status == 1">付款方式：{{item.pay_name}}</p>
        <p>创建时间：{{foramtTime1(item.created_at, 'YYYY-MM-DD HH:mm:ss')}}</p>
        <p v-if="item.pay_status == 1">付款时间：{{foramtTime1(item.pay_time, 'YYYY-MM-DD HH:mm:ss')}}</p>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  import {formatTime} from '@/common/js/utils'
  export default {
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      goodAmount () {
        let getNum = this.getNum
        let detailData = this.item
        return this.toDecimal2(getNum(detailData.goods_amount) + getNum(detailData.pay_fee) + getNum(detailData.shipping_fee))
      },
      couponAmount () {
        let getNum = this.getNum
        let detailData = this.item
        return this.toDecimal2(getNum(detailData.coupon_amount) + getNum(detailData.discount_amount))
      }
    },
    methods: {
      close () {
        this.$emit('close')
      },
      getStatus () {
        let orderStatus = this.item.order_status
        let payStatus = this.item.pay_status

        if (orderStatus < 2 && !payStatus) {
          return '未支付'
        } else if (orderStatus === 2) {
          return '已取消'
        } else if (payStatus === 1) {
          return '已付款'
        }
      },
      cancelOrder () {
        this.$emit('cancelOrder', this.item.id)
      },
      payOrder () {
        this.$emit('payOrder', this.item.id)
      },
      deleteOrder () {
        this.$emit('deleteOrder', this.item.id)
      },
      foramtTime1 (t, v) {
        let time = new Date(t * 1000)
        return formatTime(time, v)
      },
      // 格式化价格
      getNum (s) {
        return parseFloat(parseFloat(s).toFixed(2))
      },
      toDecimal2 (x) {
        let f1 = parseFloat(x)
        if (isNaN(f1)) {
          return false
        }
        let f = Math.round(x * 100) / 100
        let s = f.toString()
        let rs = s.indexOf('.')
        if (rs < 0) {
          rs = s.length
          s += '.'
        }
        while (s.length <= rs + 2) {
          s += '0'
        }
        return s
      }
    }
  }
</script>
<style lang="scss" scoped>

  .order-item {
    height: 158px;
  }

  .order-detail-1 {
    padding: 0 18px;
    background-color: #fff;
    border-top: 1px #fff solid;
  }

  .order-detail-price > p ,.order-detail-foot > p{
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 15px 0;
  }

  .order-detail-2 {
    margin-top: 10px;
    padding: 18px;
    color: #8190A7;
    font-size: 12px;
    background-color: #fff;
  }

  .order-detail-2 > p {
    margin-bottom: 18px;
  }

  .order-item {
    padding: 0 18px;
    margin-bottom: 10px;
    background-color: #fff;
  }

  .order-item > div{
    display: flex;
    align-items: center;
  }

  .order-item-head {
    justify-content: space-between;
    height: 46px;
    border-bottom: 1px solid #D7DDE5;
    color: #2C2F32;
  }

  .order-item-head > span {
    color: #8190A7;
  }

  .order-item-body {
    display: flex;
    height: 110px;
  }

  .order-item-img {
     margin-right: 15px;
    width: 150px;
    height: 84px;
    overflow: hidden;
  }

  .order-item-img > img {
    width: 100%;
  }

  .order-item-info {
    flex: 1;
    display: flex;
    height: 84px;
  }

  .order-item-info > div {
    flex: 4;
    color: #3D5372;
  }

  .order-item-info > div span {
     margin-top: 10px;
     font-size: 12px;
     color: #8190A7;
   }
  .order-item-info > span {
    flex: 1;
    text-align: right;
    color: #2C2F32;
  }

  .order-item-foot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 52px;
    font-size: 12px;
    border-top: 1px solid #D7DDE5;
  }

  .order-item-foot > a {
    margin-left: 10px;
    padding: 5px 15px;
    font-size: 12px;
    border: 1px solid #CDD3DC;
    border-radius: 82px;
  }

  .order-item-foot > a.payment {
    border-color: #FF5808;
    color: #FF5808;
  }
</style>


