<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: 'skinMarket' }">皮肤市场</el-breadcrumb-item>
        <el-breadcrumb-item>添加编辑皮肤</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="conbtent">
      <div class="tabel-content">
        <el-form :model="editForm" ref="editForm" :rules="rules" label-width="100px">
          <el-form-item label="皮肤名称" prop="skinName">
            <el-input v-model="editForm.skinName"></el-input>
          </el-form-item>
          <el-form-item label="皮肤图片" prop="pictureUrl">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="editForm.pictureUrl" :src="editForm.pictureUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{editForm.pictureUrl ? '修改图片' : '选择上传'}}</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过100kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="皮肤代码" prop="skinCode">
            <el-input
              type="textarea"
              :rows="20"
              placeholder="请填写代码"
              v-model="editForm.skinCode"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="落地页ID">
            <el-input :disabled="true" :value="String(editForm.loadPageIds)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
  import qs from 'qs';
  import {getParams} from '../../../utils/query'

  export default {
    name: 'editSkin',
    data() {
      return {
        editForm: {
          skinName: '',
          skinCode: '',
          loadPageIds: '',
          pictureUrl: '',
          id: ''
        },
        rules: {
          skinName: [
            {required: true, message: '请输入皮肤名称', trigger: 'blur'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
          ],
          skinCode: [
            {required: true, message: '请输入皮肤代码', trigger: 'blur'}
          ],
          pictureUrl: [
            {required: true, message: '请上传图片'}
          ]
        }
      }
    },
    created() {
      this.loadForm();
    },
    methods: {
      loadForm() {
        const query = getParams();
        if (!query.id) return
        this.id = query.id;
        this.$http.get('/skin/find', {params: {id: query.id}}).then(res => {
          if (res.data.success) {
            this.editForm = Object.assign({}, this.editForm, res.data.data)
          } else {
            this.$message.error('请求失败')
          }
        }).catch(() => {
          this.$message.error('网络错误')
        })
      },

      handleAvatarSuccess(res, file) {
        this.editForm.pictureUrl = URL.createObjectURL(file.raw);
      },

      beforeAvatarUpload(file) {
        const isJLtType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLtSize = file.size / 1024 <= 100;
        if (!isJLtType) {
          this.$message.error('上传皮肤图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传皮肤图片大小不能超过 100KB!');
        }
        return isJLtType && isLtSize;
      },

      // 新增修改皮肤
      save() {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            let {skinName, pictureUrl, skinCode, id} = this.editForm
            let params = {
              skinName,
              pictureUrl,
              skinCode,
              id
            };
            this.$http.post('/skin/save', qs.stringify(params)).then(res => {
              if (res.data.success) {
                this.$message.success('操作成功')
                this.$router.push('skinMarket')
              } else {
                this.$message.error('操作失败')
              }
            }).catch(() => {
              this.$message.error('网络错误')
            })
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push('skinMarket')
      }
    }
  }
</script>

<style lang="less">
  .image {
    width: 100%;
    display: block;
  }

  .avatar {
    width: 10rem;
    vertical-align: bottom;
  }

  .skin-box {
    padding: 10px;
    line-height: 24px;
  }

  .skin-name {
    text-align: center;
    font-size: 24px;
    padding-top: 10px;
  }

  .conbtent {
    margin-top: 20px;
  }

  .dlv-main {
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
    .el-form-item {
      margin-bottom: 40px;
    }
  }

</style>
