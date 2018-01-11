<template>
  <div>
    <div class="m_wrap">
      <van-nav-bar class="m_header" fixed left-arrow @click-left="close">
        <span slot="title">个人资料</span>
      </van-nav-bar>
      <div class="m_body pad16">
        <div class="avater_cell">
          <div class="avater_cell_left">
            <p>个人头像</p>
          </div>
          <div class="avater_cell_right">
            <div class="upload_avater">
              <input @change="uploadAvater" type="file" ref="file">
              <img :src="info.avater == '' ? '/static/images/Avatar_s@3x.png' : info.avater">
              <van-icon name="arrow" />
            </div>

          </div>
        </div>
        <van-cell-group class="my_cell_group">
          <van-cell title="手机号" :value="phoneNum" clickable></van-cell>
          <van-cell @click.native="showInput({key: 'realname', title: '姓名'})" title="姓名" :value="info.realname" clickable is-link></van-cell>
          <van-cell @click.native="showInput({key: 'en_name', title: '英文名'})" title="英文名" :value="info.en_name === '' ? '未填' : info.en_name" clickable is-link></van-cell>
          <van-cell @click.native="sexShow = true" title="性别" :value="formatSex(info.sex)" clickable is-link></van-cell>
          <van-cell @click.native="gradeShow = true" title="年级" :value="formatGrade(info.grade)" clickable is-link></van-cell>
          <van-cell @click.native="showInput({key: 'school', title: '学校'})" title="学校" :value="info.school" clickable is-link></van-cell>
        </van-cell-group>
        <a class="m_btn" @click="resetPassVis = true">修改密码</a>
        <a class="m_btn m_btn_disabled"  @click="signOut">退出登陆</a>
      </div>
    </div>
    <transition name="right-in">
      <div key="editUser" class="m_wrap" v-if="visiable">
        <van-nav-bar class="m_header" fixed left-arrow @click-left="save" right-text="保存" @click-right="save">
          <span slot="title">{{title}}</span>
        </van-nav-bar>
        <div class="m_body">
          <van-cell-group class="my_cell_group">
          <van-field v-model="info[key]" :placeholder="`请输入${title}`" />
          </van-cell-group>
        </div>
      </div>
      <div key="resetPass" class="m_wrap" v-if="resetPassVis">
        <van-nav-bar class="m_header" fixed left-arrow @click-left="resetPassVis = false">
          <span slot="title">修改密码</span>
        </van-nav-bar>
        <div class="m_body pad16">
          <div class="m_input_group">
            <input class="m_input" v-model="oldPassword" type="password" placeholder="旧密码">
            <input class="m_input" v-model="newPassword" type="password" placeholder="新密码">
            <input class="m_input" v-model="rePassword" type="password" placeholder="重复密码">
          </div>
          <a class="m_btn" @click="editPass">修改密码</a>
        </div>
      </div>
    </transition>
    <van-actionsheet v-model="sexShow">
      <van-picker
        show-toolbar
        title="性别"
        :columns="columns"
        @cancel="sexShow = false"
        @confirm="onChangeSex"
      />
    </van-actionsheet>
    <van-actionsheet v-model="gradeShow">
      <van-picker
        show-toolbar
        title="年级"
        :columns="columns1"
        @cancel="gradeShow = false"
        @confirm="onChangeGrade"
      />
    </van-actionsheet>

  </div>
</template>

<script>
  import {removeCookie} from '@/common/js/utils'
  export default {
    name: 'editUser',
    data () {
      return {
        info: '',
        imgType: '',
        key: '',
        title: '',
        columns: ['男', '女'],
        columns1: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '初一', '初二', '初三'],
        visiable: false,
        resetPassVis: false,
        sexShow: false,
        gradeShow: false,
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      }
    },
    created () {
      this.info = JSON.parse(JSON.stringify(this.userInfo))
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      },
      phoneNum () {
        if (window.localStorage.getItem('phoneNum')) {
          return window.localStorage.getItem('phoneNum')
        }
        return '未绑定'
      },
      status () {
        return this.$store.state.editStatus
      }
    },
    watch: {
      info: {
        handler (n, o) {
          if (o !== '') {
            this.$store.commit('CHANGE_USER_STATUS', true)
          }
        },
        deep: true
      }
    },
    methods: {
      signOut () {
        let {post} = this.$axios

        this.$dialog.confirm({
          title: '提示',
          message: '是否确认退出？'
        }).then(() => {
          post('/v1/member/sign-out')
            .then(({data}) => {
              if (!data.status) {
                if (window.dsBridge) {
                  let info = this.$store.state.userInfo
                  let res = window.dsBridge.call('doOutClick', info)
                  res && removeCookie('student')
                }
                removeCookie('student')
                this.$router.push('/login')
                this.$store.commit('UPLOAD_USER_INFO', {})
              }
            })
        })
      },
      editPass () {
        let {put} = this.$axios
        let {newPassword, rePassword, oldPassword} = this
        if (!(newPassword !== '' && rePassword !== '' && oldPassword !== '')) {
          this.$toast('请确认信息填写完整！')
          return
        }
        if (newPassword !== rePassword) {
          this.$toast('两次密码不相同！')
          return
        }
        this.$toast.loading()
        put('/v1/member/change-pwd', {old_password: oldPassword, new_password: newPassword, re_password: rePassword})
        .then(({data}) => {
          this.$toast.clear()
          if (!data.staus) {
            this.$toast.success('更新成功')
            this.resetPassVis = false
          } else {
            this.$dialog.alert({
              title: '更新失败',
              message: data.message
            })
          }
        })
      },
      save () {
        this.visiable = false
      },
      showInput (obj) {
        this.visiable = true
        this.key = obj.key
        this.title = obj.title
      },
      close () {
        if (this.status) {
          this.$dialog.confirm({
            title: '提示',
            message: '你确认要更新个人资料吗？'
          }).then(() => {
            this.savaInfo()
          }).catch(() => {
            this.$router.go(-1)
          })
        } else {
          this.$router.go(-1)
        }
      },
      savaInfo () {
        let {put, post} = this.$axios
        this.$toast.loading()
        put('/v1/member/change-profile', this.info)
        .then(({data}) => {
          this.$toast.clear()
          this.$store.commit('CHANGE_USER_STATUS', false)
          if (!data.status) {
            this.$store.commit('UPLOAD_USER_INFO', this.info)
            this.$router.go(-1)
          } else {
            this.$dialog.alert({
              title: '错误',
              message: data.message
            })
          }
        })
        this.imgType && post('/v1/member/upload-avater', {
          imgData: this.info.avater.split(',')[1],
          imgType: this.imgType
        })
        .then(({data}) => {
          if (!data.status) {
            put('/v1/member/change-avater', {
              avater_id: data.data.avater_id
            })
          }
        })
      },
      uploadAvater (e) {
        let rex = /(png|jpg|jpeg)/
        let readFile = new FileReader()
        readFile.readAsDataURL(e.target.files[0])
        readFile.onload = () => {
          this.info.avater = readFile.result
          this.imgType = rex.exec(readFile.result.split(',')[0])[0]
        }
      },
      onChangeGrade (value, index) {
        this.info['grade'] = index + 1
        this.gradeShow = false
      },
      onChangeSex (value, index) {
        this.info['sex'] = index + 1
        this.sexShow = false
      },
      formatSex (v) {
        let arr = ['男', '女']
        if (v === '0' || v === 0) {
          return '未填'
        }
        return arr[v - 1]
      },
      formatGrade (v) {
        let arr = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级', '七年级', '初一', '初二', '初三']
        if (v === '0' || v === 0) {
          return '未填'
        }
        return arr[v - 1]
      }
    }
  }
</script>

<style lang="scss" scoped>

  .m_body {
    padding-top: 16px;
  }
  .pad16 {
    padding: 16px;
  }
  .my_cell_group {
    margin-bottom: 12px;
  }

  .avater_cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    margin-bottom: 12px;
    background-color: #fff;
  }

  .upload_avater {
    position: relative;
    width: 100px;
    height: 64px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      position: absolute;
      opacity: 0;
      width: 100%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
  }

  .m_btn {
    margin-top: 10px;
  }
</style>


