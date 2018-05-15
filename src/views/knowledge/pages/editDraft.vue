<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/curriculum' }">课程</el-breadcrumb-item>
        <el-breadcrumb-item >编辑文稿</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-form :model="draftForm" ref="draftForm" label-width="100px" class="column-uleForm">
        <el-form-item label="文稿详情" prop="detail">
          <div id="editorElem" style="text-align:left"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">保存</el-button>
          <router-link :to="{ path: '/manager/knowledge/curriculum'}">
             <el-button type="pain">取消</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>
<script>
  import E from 'wangeditor'
  import qs from 'qs'
  export default {
    data() {
      return {
        //新增编辑课程form表单
        draftForm: {
          id: null,
          detail: null
        },
        fileText: null,
        fileSrc: null
      }
    },
    mounted (){
      this.creatRichText();
      this.getDraftDetail();
    },
    methods: {
      creatRichText(res){
        console.log('editor')
        var editor = new E('#editorElem')
        /* 处理上传图片的controller路径 */
        editor.customConfig.uploadImgServer = '/upload/image'
        /* 定义上传图片的默认名字 */
        editor.customConfig.uploadFileName = 'imageFile'
        editor.customConfig.withCredentials = false;
        editor.customConfig.debug=true;
        editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          // 'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          // 'link',  // 插入链接
          // 'list',  // 列表
          'justify',  // 对齐方式
          // 'quote',  // 引用
          // 'emoticon',  // 表情
          'image',  // 插入图片
          // 'table',  // 表格
//          'video',  // 插入视频
          // 'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ];
        editor.customConfig.uploadImgHooks = {
          customInsert: function (insertImg, result, editor) {
            // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
            // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
            // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            var url = result.data.fileUrl
            insertImg(url)
            // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        };
        editor.customConfig.onchange = (html) => {
          const content = html=='<p><br></p>'?'':html;
          this.draftForm.detail = content;
        }
        editor.create()
        editor.txt.clear();
        editor.txt.html(res || null)
      },

      getDraftDetail() {
        let id = this.$route.params.id;
        let params = {
          id: id
        }
        this.$http.get('/editor/content', {params: params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.draftForm = resp.data
            this.creatRichText(this.draftForm.detail)
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },

      submitForm() {
        this.$http.post('/editor/save', qs.stringify(this.draftForm)).then(res => {
          let data = res.data
            if (data.success) {
              this.$message.success('保存成功')
              this.$router.push('/manager/knowledge/curriculum')
            } else {
              let msg = data.desc || '保存失败'
              this.$message.error(msg)
              //this.$router.push('/manager/knowleage/curriculum')
            }
        }).catch(() => {

        })
      }
    }
  }

</script>
<style lang="less" scoped>
  .ofa-main-wrap {
    width: 100%;
    .totle-time {
      color: #333;
    }
    .audio-list {
      .file-container {
        width: 300px;
        height: 40px;
        border: 1px solid #aaa;
        text-align: center;
        color: #606266;
      }

      .el-upload-list__item, .el-upload-list__item:first-child {
        line-height: 40px;
        margin-top: 0
      }
      .el-upload-list {
        width: 300px;
        height: 40px;
        border: 1px solid #ccc;
        line-height: 40px;
      }
    }
    .course-title {
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 10px;
      border-bottom: 1px solid #c0c0c0;
    }

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
      .add-ofa {
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 10px;
        font-size: 12px;
      }
      .offical-acount {
        cursor: pointer;
        color: #909399;
        font-weight: 400;
        &:hover {
          color: #333;
        }
      }
    }
    .search-bar, .column-uleForm {
      margin-top: 20px;
    }
    .page-control {
      float: right;
      margin-top: 20px;
      &:after {
        clear: both;
      }
    }
  }
</style>
