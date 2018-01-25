<template>
  <section class="ofa-creat-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/officalAcount' }">公众号</el-breadcrumb-item>
        <el-breadcrumb-item>添加（编辑）</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="basic-edit-content">
      <p class="bottom-line">基础信息</p>
      <el-form ref="params" :rules="rules"  :model="params" label-width="120px">
        <el-form-item label="公众号"  prop="name">
          <el-input v-model="params.name" placeholder="福利汇1"></el-input>
        </el-form-item> 
        <el-form-item label="微信号" prop="wechatId">
          <el-input v-model="params.wechatId" placeholder="fulihui1"></el-input>
        </el-form-item>
        <el-form-item label="原始ID" prop="originId">
          <el-input v-model="params.originId"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <div>
            <el-upload
              action="/upyun/adminUploadImage"
              list-type="picture-card"
              :on-success="handleAvatarSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="二维码">
          <div>
            <el-upload
              action="/upyun/adminUploadImage"
              list-type="picture-card"
              :on-success="handleQrcodeSuccess">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>         
        </el-form-item>
        <el-form-item label="公众号类型" prop="type">
          <el-select v-model="params.type" placeholder="请选择活动区域">
            <el-option label="普通订阅号" value="普通订阅号"></el-option>
            <el-option label="认证订阅号" value="认证订阅号"></el-option>
            <el-option label="普通服务号" value="普通服务号"></el-option>
            <el-option label="认证服务号" value="认证服务号"></el-option>
          </el-select>
        </el-form-item>
        <p class="bottom-line">公众号开发设置</p>
        <el-form-item label="AppID" prop="appId">
          <el-input v-model="params.appId" placeholder="wx37e00afed7129880"></el-input>
        </el-form-item>
        <el-form-item label="AppSecret" prop="appSecrect">
          <el-input v-model="params.appSecrect" placeholder="wxsdlkjflsdkjflsdkflsdhfuw"></el-input>
        </el-form-item>
        <p class="bottom-line">服务器设置</p>
        <el-form-item label="URL" prop="serverUrl">
          <el-input v-model="params.serverUrl"></el-input>
        </el-form-item>
        <el-form-item label="Token" prop="serverToken">
          <el-input v-model="params.serverToken"></el-input>
        </el-form-item>
         <el-form-item label="EncodingAESKey" prop="serverEaeskey">
          <el-input v-model="params.serverEaeskey"></el-input>
        </el-form-item>
        <el-form-item label="加密方式">
          <el-select v-model="params.serverEacryType" placeholder="请选择加密方式">
            <el-option label="明文模式" value="明文模式"></el-option>
            <el-option label="兼容模式" value="兼容模式"></el-option>
            <el-option label="安全模式" value="安全模式"></el-option>
          </el-select>
        </el-form-item>                                                                       
      </el-form>
    </div>
    <div class="save-wrap">
        <el-button>取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>

    </div>
  </section>
</template>

<script>
import ofarules from '../components/ofaCreateValidRules'
export default {
  data () {
    return {
      rules: ofarules,
      params: {
        name: '',
        wechatId: '',
        originId: '',
        avatar: '',
        qrcode: '',
        type: '',
        serverUrl: '',
        serverToken: '',
        appId: '',
        appSecrect: '',
        serverEaeskey: '',
        serverEacryType: ''
      }
    }
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.getEditMsg(id)
    }
  },
  methods: {
    onSave () {
      this.$refs['params'].validate((valid) => {
        if (valid) {
          let _params = Object.assign(this.params)
          if (this.id) {
            _params.id = this.id
          }
          this.$http.post('/subscriptionInfo/save', _params).then(res => {
            let data = res.data
            if (data.success) {
              this.$message.success('保存成功')
            } else {
              let msg = data.desc || '保存失败'
              this.$message.error(msg)
              this.$router.push('/manager/officalAcount')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getEditMsg (id) {
      this.$http.get('/subscriptionInfo/find', {
        params: { id: id }
      }).then(res => {
        if (res.data.success) {
          this.params = res.data.data
        }
      })
    },
    handleQrcodeSuccess (res) {
      console.log(res)
    },
    handleAvatarSuccess (res) {
      console.log(res)
    }
  }
}
</script>

<style lang="less">
.ofa-creat-wrap {
  width: 100%;
  .title-wrap {
    width: 100%;
    height: 30px;
    border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb {
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }
  }
  .basic-edit-content {
    width: 80%;
  }
  .save-wrap {
    margin: 50px;
  }
  .bottom-line {
    border-bottom: 1px dashed #ccc;
    padding: 10px 0;
  }
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>

