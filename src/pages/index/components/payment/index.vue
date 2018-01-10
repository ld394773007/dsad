<template>
  <div class="m_wrap payment_wrap">
    <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
      <span slot="title">付款</span>
    </van-nav-bar>
    <div class="m_body" v-if="detailData" style="padding: 16px;">
      <span>订单信息</span>
      <div class="m_tab_content">
        <h2 class="payment_info_title">{{detail.pro_name}}</h2>
        <span>开始时间：{{formatStartTime}}</span>
        <span>科目：<i>{{detail.link.category.title}}</i></span>
        <div class="total">
          <p>商品总价: </p><span>¥<i>{{goodAmount}}</i></span>
        </div>
        <div class="price">
          <p>需支付: </p><span class="blue">¥<i>{{isFree ? '0.00' : '99.00'}}</i></span>
        </div>
      </div>
      <div class="pay_mode">
        <van-radio :name="item.pay_code" v-model="pay_code" :key="item.pay_code" v-for="item in payList">
          <div class="pay_radio_left">
            <i class="wechat"></i>
            <span>微信支付</span>
          </div>
        </van-radio>
      </div>
      <div class="fixed_btn_wrap">
        <a class="fixed_btn_wrap_left" href="javascript:">
          <span>共1项, 总计：</span><span class="blue">¥<i>{{toDecimal2(getNum(detailData.order_amount))}}</i></span>
        </a>
        <a class="fixed_btn_wrap_right" href="javascript:" @click="sendPay">确定支付</a>
      </div>
    </div>
    <transition name="right-in">

    </transition>
  </div>
</template>

<script>
  export default {
    name: 'payment',
    props: {
      id: {
        type: [Number, String],
        default: 0,
        require: true
      },
      detail: {
        type: Object,
        default: () => ({})
      },
      isFree: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        radio: '1',
        detailData: null,
        payList: [],
        pay_code: '',
        showPopup: true,
        countTime: (1000 * 60 * 30)
      }
    },
    created () {
      this.getPayList()
      this.getOrderDeatil()
    },
    computed: {
      formatCountTime () {
        let minute = Math.floor(this.countTime / 60 / 1000)
        let second = Math.floor(this.countTime / 1000 % 60)

        let m = minute < 10 ? '0' + minute : minute
        let s = second < 10 ? '0' + second : second

        return ` ${m}分${s}秒 `
      },
      goodAmount () {
        let getNum = this.getNum
        let detailData = this.detailData
        return this.toDecimal2(getNum(detailData.goods_amount) + getNum(detailData.pay_fee) + getNum(detailData.shipping_fee))
      },
      couponAmount () {
        let getNum = this.getNum
        let detailData = this.detailData
        return this.toDecimal2(getNum(detailData.coupon_amount) + getNum(detailData.discount_amount))
      },
      formatStartTime () {
        if (!this.detail) return ' '
        let start = this.detail.link.start_time.split('-')
        return `${start[0]}年${start[1]}月${start[2]}日`
      }
    },
    methods: {
      close () {
        this.$emit('close')
      },
      countDown () {
        if (this.countTime > 0) {
          this.countTime -= 1000
          setTimeout(() => {
            this.countDown()
          }, 1000)
        }
      },
      sendPay () {
        this.$emit('sendPay', this.pay_code)
      },
      // 获取订单详情
      getOrderDeatil () {
        let { get } = this.$shopApi
        get('/v1/order/detail', {
          params: {
            'order_id': this.id,
            expand: 'product, coupon, payLog'
          }
        })
          .then(({data}) => {
            if (!data.status) {
              this.detailData = data.data
            } else {
              this.$dialog.alert({
                message: data.message
              })
            }
          })
      },
      // 获取支付方式列表
      getPayList () {
        let { get } = this.$shopApi
        get('/v1/order/pay-list')
          .then(({data}) => {
            if (!data.status) {
              this.payList = data.data
              this.pay_code = data.data[0].pay_code
            }
          })
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
    },
    components: {
      QRcode: () => import('../QRcode')
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/minix/index';
  @import '../../assets/scss/variable/index';

  .sub_message {
    padding-top: 16px;
    text-align: right;
    color: $color_theme;
  }

  .m_body>span {
    color: #ADADBD;
  }

  .payment_wrap {
    .payment_info_title {
      font-size: 20px;
    }
    .pay_mode {
      margin-top: 15px;
      padding: 16px;
      background-color: #fff;
      .van-radio {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row-reverse;
      }
      .van-radio .van-icon-checked {
        color: $color_theme;
      }
      .pay_radio_left {
        display: flex;
        align-items: center;
        color: #212128;
        i {
          margin-right: 10px;
        }
      }
      .wechat {
        display: block;
        width: 40px;
        height: 40px;
        @include dprImg('wechat');
        background-size: 155%;
        background-position: center -5px;
      }
    }
    .fixed_btn_wrap_left {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1.5;
      padding-left: 48px;
      color: #212128;
      .blue {
        margin-right: 10px;
        color: $highlight_text_color;
        font-size: 14px;
        font-weight: bold;
        i {
          margin-left: 3px;
          font-size: 24px;
        }
      }
    }
    .fixed_btn_wrap_right {
      flex: 1;
    }
    .m_tab_content {
      .price {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-top: 0;
        p {
          margin-right: 10px;
          font-size: 14px;
          color: #212128;
        }
      }
    }

    .total {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      p {
        margin-right: 5px;
        font-size: 14px;
      }
      span {
        font-size: 16px;
        margin-bottom: 0;
      }
    }
  }



</style>


