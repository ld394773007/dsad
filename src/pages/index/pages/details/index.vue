<template>
  <div class="m_wrap"  ref="content">
    <van-nav-bar class="m_header" fixed>
      <span slot="title">课程介绍</span>
    </van-nav-bar>
    <div class="deatils-tab" :class="`active-${active}`">
      <a  @click="_scrollTo(0)">课程</a>
      <a  @click="_scrollTo(1)">大纲</a>
      <a  @click="_scrollTo(2)">详情</a>
    </div>
    <div class="m_body" style="top:82px;padding-top: 10px;display: flex; justify-content: center;" v-if="!detailData">
      <van-loading style="width: 22px; height: 22px;" type="circle" color="black" />
    </div>
    <transition name="bottom-go">
      <srcoll v-if="detailData" :data="detailData" @init="_calculateHeight" :listenScroll="true" :probeType="3" @scroll="scroll" ref="scroll" class="m_body" style="top:82px;margin: 8px 16px;">
        <div class="m_tab_wrap content" style="padding-bottom: 50px;">
          <div class="m_tab_content deatils_content mod_content">
            <h2>{{detailData.pro_name}}</h2>
            <span>开始时间：{{formatStartTime}}</span>
            <span>科目：<i>{{detailData.link.category.title}}</i></span>
            <!-- <div class="price">
              <span class="blue">¥<i>{{detailData.promote_price ? detailData.promote_price : detailData.price}}</i></span>
            </div> -->
          </div>
          <div class="m_tab_content deatils_content mod_content">
            <p class="m_tab_content_title">课程大纲</p>
            <div class="no_dg" v-if="!lesson.length">暂无大纲</div>
            <ul v-if="lesson.length">
              <li :key="item.id" v-for="(item, index) in lesson">
                <p><i>{{index + 1}}.</i>{{item.name}}</p>
                <span>{{formatTime(item.start_time)}}</span>
              </li>
            </ul>
            <div class="tab_btn_wrap" v-if="lesson.length">
              <van-button class="tab_btn" size="small" @click="handlerShow('Outline')">查看全部课程</van-button>
            </div>
          </div>
          <div class="m_tab_content deatils_content mod_content">
            <p class="m_tab_content_title">课程详情</p>
            <p>【课程难度】</p>
            <div class="start-content">
              <i class="iconfont start">&#xe80a;</i>
              <i class="iconfont start" >&#xe80a;</i>
              <i class="iconfont start">&#xe80a;</i>
              <i class="iconfont start">&#xe80a;</i>
              <i class="iconfont start">&#xe7f1;</i>
            </div>
            <div class="introduce-content" v-html="detailData.pro_desc"></div>
            <div class="img-wrap">
              <img src="/static/images/deatils.jpg" />
              <a @click="download"></a>
            </div>

          </div>
        </div>
      </srcoll>
    </transition>
    <div class="fixed_btn_wrap">
      <!-- <a class="fixed_btn_wrap_left" href="javascript:" @click="showVisiable">
        <i class="iconfont">&#xe692;</i>
        <span>联系客服</span>
      </a> -->
      <a class="fixed_btn_wrap_right" href="javascript:" @click="getPayList(0)">立即预约</a>
    </div>
    <div class="m_popup" v-if="visiable">
      <div class="m_popup_mask" @click="handlerCancel"></div>
      <div class="m_popup_container">
        <div class="m_popup_content">
          <p class="m_popup_content_title">在线客服</p>
          <span>请扫下面二维码加客服微信</span>
          <div class="ewm">
            <img src="">
          </div>
        </div>
        <div class="m_popup_btn_wrap">
          <a href="javascript:" class="cancel" @click="handlerCancel">取消</a>
          <a href="javascript:" class="confirm" @click="handlerConfirm">确定</a>
        </div>
      </div>
    </div>
    <transition-group name="right-in">
      <payment style="z-index:10;" :isFree="isFree" key="payment" @sendPay="sendPay" :id="orderId" :code="QRcode" :detail="detailData" @close="handlerClose('Pay')" v-if="visiablePay" />
      <outline style="z-index:10;" :data="lessonList" key="outline" @close="handlerClose('Outline')" v-if="visiableOutline"/>
      <payLogin style="z-index:10;" key="payLogin" @close="handlerClose('PayLogin')" v-if="visiablePayLogin"></payLogin>
      <QRcode style="z-index:10;" key="QRcode" @success="success" v-if="QRcode !== ''" @close="QRcode = ''" :code="QRcode" :id="orderId" />
      <payResult style="z-index:11;" key="payResult" v-if="visiableResult" :data="detailData" :startTime="formatStartTime" :price="toDecimal2(getNum(detailData.price))"></payResult>
    </transition-group>
  </div>
</template>

<script>
  import {formatTime, ismobile} from '@/common/js/utils'
  export default {
    name: 'm-details',
    components: {
      srcoll: () => import('@/components/srcoll'),
      payment: () => import('../../components/payment'),
      outline: () => import('../../components/outline'),
      payLogin: () => import('../../components/payLogin'),
      QRcode: () => import('../../components/QRcode'),
      payResult: () => import('../../components/payResult')
    },
    data () {
      return {
        active: '0',
        tabList: ['课程', '大纲', '详情'],
        scrollY: 0,
        listHeight: [],
        lessonList: [],
        visiable: false,
        visiablePay: false,
        visiableOutline: false,
        visiablePayLogin: false,
        visiableResult: false,
        detailData: null,
        orderId: 0,
        QRcode: '',
        payList: [],
        pay_code: ''
      }
    },
    computed: {
      // 格式化开始时间
      formatStartTime () {
        if (!this.detailData) return ' '
        let start = this.detailData.link.start_time.split('-')
        return `${start[0]}年${start[1]}月${start[2]}日`
      },
      // 判断是否是0元商品
      isFree () {
        if (!this.detailData) return 0
        return Number(this.detailData.price) === 0
      },
      lesson () {
        return this.lessonList.slice(0, 5)
      }
    },
    mounted () {
      let {orderId} = this.$route.query
      this.id = orderId
      if (orderId) {
        this.getPayStatus()
      }
      let {id} = this.$route.query
      this.id = id
      this.getDetail()
    },
    methods: {
      download () {
        if (ismobile(0) === '0') {

        } else {
          window.location = 'http://www.yingyushu.com/app_download/ding.apk'
        }
      },
      formatTime (t) {
        let time = formatTime(new Date(t * 1000), 'YYYY-MM-DD HH:mm').split(' ')
        let time1 = time[0].split('-')
        return `${time1[0]}年${time1[1]}月${time1[2]}日 ${time[1]}`
      },
      success () {
        this.visiableResult = true
      },
      // 显示组件
      handlerShow (v) {
        this[`visiable${v}`] = true
      },
      // 关闭组件
      handlerClose (v) {
        this[`visiable${v}`] = false
      },
      showVisiable () {
        this.visiable = true
      },
      handlerCancel () {
        this.visiable = false
      },
      handlerConfirm () {
        this.visiable = false
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      // 计算scroll区域内容的高度
      _calculateHeight () {
        const list = this.$refs.content.querySelectorAll('.m_tab_content')
        if (!list) {
          return
        }
        let height = 0
        this.listHeight = []
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 滚动定位效果
      _scrollTo (index) {
        let listGroup = this.$refs.content.querySelectorAll('.m_tab_content')
        if (!index && index !== 0) {
          return
        }
        this.active = index
        this.$refs.scroll.scrollToElement(listGroup[index], 100)
        this.scrollY = this.$refs.scroll.scroll.y
      },
      // 获取课程列表
      getLesson (id) {
        let {get} = this.$shopApi

        get('/v1/product/get-lessons', {
          params: {courseId: id}
        }).then(({data}) => {
          if (!data.status) {
            this.lessonList = data.data
          }
        })
      },
      // 获取商品信息
      getDetail () {
        let { get } = this.$shopApi

        get('/v1/product/detail', {
          params: {
            id: this.id,
            expand: 'link,images,platform'
          }
        })
        .then(({data}) => {
          if (!data.status) {
            this.detailData = data.data
            this.getLesson(data.data.link.id)
            let title = document.getElementById('title')
            let img = document.getElementById('image')
            let description = document.getElementById('description')

            // 设置页面分享信息
            title.setAttribute('content', data.data.pro_name)
            img.setAttribute('content', data.data.thumb_src)
            description.setAttribute('content', data.data.pro_brief)
          }
        })
      },
      // 发起支付
      sendPay (code) {
        this.$toast.loading()
        let { post } = this.$shopApi
        post('/v1/order/pay', {
          order_id: this.orderId,
          pay_code: code
        })
          .then(({data}) => {
            this.$toast.clear()
            if (!data.status) {
              switch (data.data.type) {
                case 'url':
                  let {path} = this.$route
                  window.localStorage.setItem('payUrl', `${path}?id=${this.id}&orderId=${this.orderId}`)
                  setTimeout(() => {
                    window.location = data.data.data
                  }, 200)
                  break
                case 'qrcode':
                  this.QRcode = data.data.data
                  break
                case 'jsapi':
                  this.sendWechart(JSON.parse(data.data.data.json))
                  break
                case 'success':
                  this.visiableResult = true
                  break
              }
            } else {
              this.$dialog.alert({
                message: data.message
              })
            }
          })
      },
      // 发起微信支付
      sendWechart (json) {
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(json), false)
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(json))
            document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(json))
          }
        } else {
          this.onBridgeReady(json)
        }
      },
      // 调用微信sdk
      onBridgeReady (data) {
        /* global WeixinJSBridge */
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          data,
          (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              this.getPayStatus()
            }
          }
        )
      },
      getPayStatus () {
        let { get } = this.$shopApi
        get('/v1/order/query-pay-status', {params: {order_id: this.id}})
          .then(({data}) => {
            if (!data.status) {
              this.$toast.clear()
              if (data.data.pay_status === 'paied') {
                this.visiableResult = true
              } else {
                this.$dialog.alert({
                  title: '提示',
                  message: '交易失败， 订单已关闭！'
                })
                this.cancelPay()
              }
            } else {
              this.$dialog.alert({
                message: data.message
              })
            }
          })
      },
      cancelPay () {
        let {post} = this.$shopApi

        post('/v1/order/cancel', {order_id: this.orderId})
      },
       // 获取支付方式列表
      getPayList (v) {
        let { get } = this.$shopApi
        get('/v1/order/pay-list')
          .then(({data}) => {
            if (!data.status) {
              this.payList = data.data
              this.pay_code = data.data[0].pay_code
              this.clearChart(v)
            }
          })
      },
      // 清空购物车
      clearChart (v) {
        let { post } = this.$shopApi
        post('/v1/cart/clear')
          .then(({data}) => {
            if (!data.status) {
              this.$toast.loading()
              this.addChart(v)
            } else {
              this.$toast.clear()
              this.$dialog.alert({
                message: data.message
              })
            }
          })
      },
      // 加入购物车
      addChart (v) {
        let { post } = this.$shopApi
        post('/v1/cart/add', {
          pro_id: this.id,
          number: 1
        })
          .then(({data}) => {
            if (!data.status) {
              this.createOrder(v)
            } else {
              this.$toast.clear()
              this.$dialog.alert({
                message: data.message
              })
            }
          })
      },
      // 创建订单
      createOrder (v) {
        let { post } = this.$shopApi
        post('/v1/order/create')
          .then(({data}) => {
            this.$toast.clear()
            if (!data.status) {
              this.orderId = data.data.id
              if (v === 0) {
                this.sendPay(this.pay_code)
              } else {
                this.handlerShow('Pay')
              }
            } else {
              this.$dialog.alert({
                message: data.message
              })
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
    watch: {
      scrollY (n) {
        const listHeight = this.listHeight

        listHeight.forEach((e, i) => {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-n >= height1 && -n < height2) {
            this.active = i
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/variable/index';
  .no_dg {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .deatils-tab {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    background-color: #fff;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 36px;
      font-size: 12px;
      color: #0B0817;
    }
    &::before {
      content: '';
      position: absolute;
      width: 33.3333%;
      bottom: 0;
      height: 2px;
      background-color: $color_theme;
      transition: all .5s;
    }
    &.active-0::before {
      left: 0;
    }
    &.active-1::before {
      left: 33.3333%;
    }
    &.active-2::before {
      left: 66.6666%;
    }
  }

  .deatils_content {
    margin-top: 12px;
    padding: 16px 12px;
    background-color: #fff;
    color: #0B0817;
    &:first-child {
      margin-top: 0;
    }
    .tab_btn_wrap {
      display: flex;
      justify-content: center;
    }
    .tab_btn {
      margin: 0 auto;
      width: 126px;
      background-color: #f8f8f8;
      span {
        color: #0B0817;
      }
    }
    h2 {
      margin-bottom: 12px;
      font-size: 22px;
    }
    p {
      font-size: 16px;
    }
    span {
      margin-bottom: 12px;
      display: block;
      color: #ADADBD;
      &.blue {
        &.title {
          margin-top: 15px;
          font-size: 16px;
          text-align: center;
        }
        margin-bottom: 0;
        font-weight: bold;
        color: $highlight_text_color;
        i {
          font-size: 24px;
        }
      }
      i.blue {
        color: #34A9FF;
      }
    }
    .img-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      img {
        width: 115%;
      }
    }
    .price {
      padding-top: 8px;
      text-align: right;
    }
    &_title {
      margin-bottom: 16px;
      font-size: 18px;
    }
    .title {
      margin-top: 10px;
      font-size: 16px;
      text-align: center;
      color: $color_theme;
    }
    .start {
      color: $highlight_text_color;
    }
    ul>li {
      margin-bottom: 16px;
      line-height: 34px;
      i {
        display: inline-block;
        width: 40px;
      }
      span {
        margin-left: 40px;
      }
    }
  }

  .introduce-content {
    padding: 15px 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    img {
      width: 100%;
    }
  }

  .fixed_btn_wrap {
    position: absolute;
    height: 49px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    z-index: 9;
    a {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 49px;
      color: #CFCFDB;
      i {
        margin-right: 5px;
      }
    }
    & > &_right {
      flex: 1.5;
      background-color: $highlight_text_color;
      color: #fff;
      &:active {
        background-color: lighten($color: $highlight_text_color, $amount: 10%)
      }
    }
  }

  .m_popup {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255,255,255,0.9);
    z-index: 99999;
    &_mask {
      position: absolute;
      left: 0;
      top: 0;
      right: -10px;
      bottom: -10px;

    }
    &_container {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 0 25px 0 rgba($color: #000000, $alpha: 0.25)
    }
    &_content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      &_title {
        font-size: 18px;
        margin-bottom: 9px;
      }
      span {
        color: #ADADBD;
      }
      .ewm {
        width: 200px;
        height: 200px;
        img {
          width: 100%;
        }
      }
    }
    &_btn_wrap {
      position: relative;
      border-top: 1px #E5E5E5 solid;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 49px;
      &::before {
        content: '';
        position: absolute;
        height: 49px;
        width: 1px;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        background-color: #E5E5E5;
      }
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 49px;
        color: #C7C7D3;
        font-size: 18px;
      }
      .confirm {
        color: #34A9FF;
      }
    }
  }

  .van-tab--active {
    color: #34A9FF;
  }

  .van-tabs__nav-bar {
    background-color: #34A9FF;
  }

  .img-wrap {
    position: relative;
    a {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      height: 200px;
    }
  }
</style>


