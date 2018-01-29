<template>
<div class="wrap">
  <el-button @click="getWeChatSetting">授权</el-button>
    
</div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    getWeChatSetting () {
      this.$http.get('/wechat/getAuthorization').then(res => {
        console.log(res)
        if (res.data.success) {
          let redirectUrl = res.data.data
          window.location.href = redirectUrl
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrap{
margin: 0 auto;
width: 100px;
margin-top: 200px
}
</style>
