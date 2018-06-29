<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/read' }">阅读计划</el-breadcrumb-item>
        <el-breadcrumb-item>书籍管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" @click="addBook(1)" size="small" class="fr">新增书籍</el-button>

    </div>
    <div class="content">

      <div class="tabel-wrap removeDefStyle">
        <template >
          <el-table :data="courseManageList" border style="width: 100%;text-align: center" > <!--:span-method="arraySpanMethod"-->

            <el-table-column prop="title" label="书籍标题" width="200">
            </el-table-column>

            <el-table-column  label="解锁日期" >
              <template slot-scope="scope">
                <div  class="itemStyle"  v-for="(item,index) in scope.row.readBookCourseVOList">第{{item.dayNum}}天</div>
              </template>
            </el-table-column>

            <el-table-column  prop="id" label="课程id" >
              <template slot-scope="scope" >
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">{{item.courseID}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="courseType" label="课程类型" >
              <template slot-scope="scope">
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">{{item.courseType==1?'音频':'其它'}}</div>
              </template>
            </el-table-column>

            <el-table-column prop="title" label="课程标题" width="300">
              <template slot-scope="scope">
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">{{item.courseTitle}}</div>
              </template>
            </el-table-column>

            <el-table-column prop = "manageStatus"  label="课程状态" >
              <template slot-scope="scope">
                <div class="itemStyle" v-for="(item,index) in scope.row.readBookCourseVOList">
                  <template v-if="item.courseStatus==0">待上线</template>
                  <template v-if="item.courseStatus==1">已上线</template>
                  <template v-if="item.courseStatus==2">已下线</template>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120">
              <template slot-scope="edit">
                <div class="itemStyle" v-for="(item,index) in edit.row.readBookCourseVOList">
                  <el-button type="text" size="mini" @click="editCourse(1,item)">编辑课程</el-button>
                  <el-button type="text" size="mini" @click="removeCourse(item)">移除</el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="140">
              <template slot-scope="edit">
                <el-button type="text" size="mini" @click="editCourse(2,edit.row)">添加课程</el-button>
                <el-button type="text" size="mini" @click="addBook(2,edit.row)">编辑</el-button>
                <el-button type="text" size="mini" @click="deleteBook(edit.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </template>
      </div>
    </div>
    <!--弹窗-->

    <div class="add-type-diolog">
      <el-dialog :title="digTite + '课程'" :visible.sync="editDiolog" style="width:80%;left:50%;margin-left:-40%;">
        <el-form :model="courseSearchForm" ref="courseSearchForm" :rules="rules">
          <el-form-item label="解锁日期：">
            第{{courseDay}}天
          </el-form-item>
          <el-form-item label="关联课程：">
            <el-select filterable v-model="courseSearchForm.selectType" style="width:50%;" @change="selChange">
              <el-option v-for="(item,index) in courseList" :key="index" :label="item.title" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="海报背景图">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess3"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseSearchForm.imgUrl" :src="courseSearchForm.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseSearchForm.imgUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">750*544,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="分享文案："  prop="shareDocument">
            <el-input style="width:80%;" placeholder="0-30个字" v-model="courseSearchForm.shareDocument" auto-complete="off"></el-input>
          </el-form-item>
          <div class="doc-tips">用户昵称nickname，感想字数commentLength，感想时间commentTimeLabel，阅读天数readDays，书籍标题bookTitle</div>
          <!-- <el-form-item label="分享图标：">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess4"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseSearchForm.iconUrl" :src="courseSearchForm.iconUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseSearchForm.iconUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">300*300,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
          </el-form-item> -->
          <!-- <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
            <el-tab-pane :label="item.name" :name="item.name" v-for="(item,index) in tabList" :key="item.id"  :value="index">
            </el-tab-pane>
          </el-tabs> -->
          <el-form-item label="感想模板：" >
            <el-tabs v-model="activeType" type="card" @tab-click="handleClick">
              <el-tab-pane :label="item.name" :name="item.name" v-for="(item,index) in tabList" :key="item.id"  :value="index">
              </el-tab-pane>
            </el-tabs>
            <el-input type="textarea" style="width:80%" placeholder="1-1000个字" v-model="content1" auto-complete="off" v-if="tabId == 1"></el-input>
            <el-input type="textarea" style="width:80%" placeholder="1-1000个字" v-model="content2" auto-complete="off" v-if="tabId == 2"></el-input>
            <el-input type="textarea" style="width:80%" placeholder="1-1000个字" v-model="content3" auto-complete="off" v-if="tabId == 3"></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-wrap">
          <el-button size="small" @click="editDiolog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="subCourse()">保存</el-button>
        </div>
      </el-dialog>
    </div>


    <!--新增|编辑书籍 弹窗-->
    <div class="add-type-diolog">
      <el-dialog title="添加|编辑书籍" :visible.sync="bookDiolog" @open="createUploader" @closed="destroyUploader">
        <div>
          <el-form :model="courseForm" ref="courseForm" :rules="rules">

          <el-form-item label="书籍标题" prop="title" class="is_required">
            <el-col :span="8">
              <el-input v-model="courseForm.title" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>

            </el-col>
          </el-form-item>

          <el-form-item label="书籍封面" prop="imgUrl">
            <el-upload
              class="avatar-uploader"
              action="/upload/image"
              name="imageFile"
              :show-file-list=false
              :on-success="firstSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="courseForm.imgUrl" :src="courseForm.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <el-button size="small" type="primary">{{courseForm.imgUrl ? '修改文件' : '选择文件'}}</el-button>
              <div slot="tip" class="el-upload__tip">360*484,支持jpg、png、gif格式,最大5M</div>
            </el-upload>
          </el-form-item>

          <!--<el-form-item label="海报背景图">-->
            <!--<el-upload-->
              <!--class="avatar-uploader"-->
              <!--action="/upload/image"-->
              <!--name="imageFile"-->
              <!--:show-file-list=false-->
              <!--:on-success="firstSuccess2"-->
              <!--:before-upload="beforeAvatarUpload">-->
              <!--<img v-if="courseForm.backGroundUrl" :src="courseForm.backGroundUrl" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              <!--<el-button size="small" type="primary">{{courseForm.backGroundUrl ? '修改文件' : '选择文件'}}</el-button>-->
              <!--<div slot="tip" class="el-upload__tip">750*544,支持jpg、png、gif格式,最大5M</div>-->
            <!--</el-upload>-->
          <!--</el-form-item>-->

            <!-- 试听音频 -->
            <!--<el-form-item label="试听音频" class="audio-list" prop="uploadFile">-->
                <!--<div>-->
                    <!--<div class="file-container">{{fileText}}</div>-->
                    <!--<el-button size="small" type="primary" id="selectfiles">选择文件</el-button>-->
                    <!--<div slot="tip" class="el-upload__tip">支持mp3、m4a格式，最大500M</div>-->
                <!--</div>-->
            <!--</el-form-item>-->

            <!--&lt;!&ndash; 书籍简介 &ndash;&gt;-->
            <!--<el-form-item label="书籍简介" prop="title">-->
                <!--<el-col :span="8">-->
                    <!--<el-input v-model="courseForm.title" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>-->
                <!--</el-col>-->
            <!--</el-form-item>-->

          </el-form>
        </div>


          <el-form :model="booksForm" ref="booksForm">

              <!-- 试听音频 -->
              <el-form-item label="试听音频" class="audio-list" prop="uploadFile">
                  <div class="audio-content">
                      <div class="file-container">{{fileText}}</div>
                      <el-button size="small" type="primary" id="selectfiles">选择文件</el-button>
                      <div slot="tip" class="el-upload__tip">支持mp3、m4a格式，最大500M</div>
                  </div>
              </el-form-item>

              <!-- 书籍简介 -->
              <el-form-item label="书籍简介" prop="title">
                  <el-col :span="8">
                      <el-input type="textarea" :rows="4" v-model="booksForm.introduction" placeholder="1-50字，建议14字以内" :maxlength="50"></el-input>
                  </el-col>
              </el-form-item>

          </el-form>

        <div class="btn-wrap">
          <el-button size="small" @click="bookDiolog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="saveBook()">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </section>

</template>
<script>
  import {formatHourSec} from '../../../utils/dateUtils'
  import E from 'wangeditor'
  import plupload from 'plupload';
  import qs from 'qs'
  import _ from 'lodash'

  import {
    getDirectTransmissionSign,
    getCdnFileUrl
  } from '@/api/index'

  export default {

    data() {
      const checkWechatID = (rule, value, callback) => {
        let inputValue = String(value)
        if(inputValue.match(/nickname/g)){
           inputValue = inputValue.replace(/nickname/g,'');
        }
        if(inputValue.match(/commentLength/g)){
           inputValue = inputValue.replace(/commentLength/g,'');
        }
        if(inputValue.match(/commentTimeLabel/g)){
           inputValue = inputValue.replace(/commentTimeLabel/g,'');
        }
        if(inputValue.match(/readDays/g)){
           inputValue = inputValue.replace(/readDays/g,'');
        }
        if(inputValue.match(/bookTitle/g)){
           inputValue = inputValue.replace(/bookTitle/g,'');
        }
        if(inputValue.length > 30){
          callback(new Error('确保长度在0-30个字'))
        }else{
          callback()
        }
        
        // // console.log(value.length)
        // setTimeout(() => {
        //   if (!reg.test(value)) {
        //     callback(new Error('请输入正确的字符'))
        //   } else {
        //     if (value.length > 20) {
        //       callback(new Error('确保长度小于20'))
        //     } else {
        //       callback()
        //     }
        //   }
        // }, 1000)
      }
      return {
        rules:{
          title: [
            {required: true, message: '请输入计划标题', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          imgUrl:[
            {required: true, message: '请上传书籍封面', trigger: 'blur'},
          ],
          shareDocument:[
            { min: 0 ,},
            {validator: checkWechatID, trigger: 'blur' }
          ]
        },
        tabId: 1,
        activeType: '模板一',
        tabList: [
          {id: 1,name: '模板一'},
          {id: 2,name: '模板二'},
          {id: 3,name: '模板三'},
        ],
        courseEditId:null,
        readId:null,
        spanArr:[],
        contactDot:0,
        editDiolog:false,
        bookDiolog:false,
        courseDay:null,
        loading: false,
        contactDot:null,
        editorContent:null,
        digTite:'编辑',
        digType:1,
        bookType:1,
        bookId:null,
        directTransmissionSign: null, // 上传签名
        pageOption: {
          pageNum: 1,
          size: 20
        },
        totalSize: 0,
        courseManageList:[],
        // 分页查询课程信息
        courseSearchForm: {
          id: null,
          title: null,
          status: '',
          pageNum: 1,
          pageSize: null,
          imgUrl:'',
          selectType:'',
          // iconUrl:'',
          shareDocument:''
        },
        content1: '',
        content2: '',
        content3: '',
        // 新增编辑课程form 表单
        courseForm: {
          title: null,
          imgUrl: '',
          backGroundUrl: ''
        },
        courseList: [],
        booksForm: {
          introduction:'',
          uploadFile: {},
          freeTime: 120,
          courseType: 1,
        },
        fileText: null,
        fileSrc: null,
        uploader: null // uploader实例化对象
      }
    },

    computed: {

    },
    created(){

    },
    mounted(){
      // this.getDirectTransmission()
    },
    // beforeUpdate(){
    //
    // },
    created() {
      this.readId = this.$route.query.readId;
      this.getData();
    },
    methods: {
      handleClick(tab, event) {
        // if(this.tabList[tab.index].id == this.tabId){
        //   return
        // }
        this.tabId = this.tabList[tab.index].id
        console.log(this.tabId )
      },
      selChange(val){
        console.log('*****'+val)
          this.courseSearchForm.selectType = val;
      },
      //获取列表数据
      getData() {
        let params ={
          readId: this.$route.query.readId,
          pageNum: this.pageOption.pageNum,
          pageSize: 20,
        }
        this.$http.get('/read/book/list', {params}).then(res => {
          let resp = res.data;
          if (resp.success) {
            this.courseManageList = resp.data ;
            this.totalSize = resp.data.totalElements ;
            let arr = this.courseManageList;
            let spanArr = this.spanArr;
            let contactDot = 0;//占几格
            if(!arr){
              return false;
            }
            arr.forEach(function (item,index) {
              item.index = index;
              if(index===0){
                spanArr.push(1)
              }else {
                if(item.title === arr[index-1].title){
                  spanArr[contactDot] +=1
                  spanArr.push(0)
                }else {
                  spanArr.push(1);
                  contactDot = index;
                }
              }
            })
            this.contactDot = contactDot;
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      removeCourse(item){
        this.$confirm('确认移除阅读课程:'+item.courseTitle, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/read/book/course/delete?id='+item.id).then(res => {
            let resp = res.data
            if (resp.success) {
              this.$message.success('删除成功');
              this.getData()
            } else {
              let msg = resp.desc || '删除失败'
              this.$message.error(msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      deleteBook(id){
        let params = {
          id:id
        }
        this.$confirm('确认删除','删除',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() =>{
          this.$http.post('/read/book/delete',qs.stringify(params)).then(res =>{
            let resp = res.data
            if(resp.success){
              this.$message.success('删除成功');
              this.getData();
            }else{
              let msg = resp.desc || '请求失败';
              this.$message.error(msg)
            }
            this.loading = false;
          }).catch(() =>{
            this.loading = false;
          })
        })

      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }){
        if (columnIndex === 0||columnIndex === 7) {

          const _row = this.spanArr[rowIndex]
          const _col = _row>0?1:0;
          return{
            rowspan:_row,
            colspan:_col
          }
        }
      },
      getDetail(id){
        this.$http.post('/read/book/detail?id='+id).then(res =>{
          let resp = res.data;
          this.courseForm = resp.data;
          this.booksForm.introduction = resp.data.introduction
          this.fileSrc = resp.data.fileSrc?resp.data.fileSrc:''
          if(_.isEmpty(resp.data.uploadFile)){
            this.booksForm.uploadFile = {}
            this.fileText = ''
          }else{
            this.fileText = resp.data.uploadFile.name
            this.booksForm.uploadFile.name = resp.data.uploadFile.name
            this.booksForm.uploadFile.url = resp.data.uploadFile.url
          }
          // console.log(resp.data)
        })
      },
      addBook(type,row){
        if(row){
          this.bookId = row.id;
          this.getDetail(this.bookId)
        }else{
          this.courseForm.title = null;
          this.courseForm.imgUrl = '';

          this.booksForm.introduction = ''
          this.booksForm.uploadFile = {}
          this.fileSrc = null
          this.fileText = null
        }

        this.bookDiolog = true;
        this.bookType = type;
        this.getDirectTransmission()
      },
      beforeAvatarUpload(file) {
        const isJLtType = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif' || file.type ==='image/jpeg';
        const isLtSize = file.size / 1024 <= 5000;
        if (!isJLtType) {
          this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传图片大小不能超过 5M!');
        }
        return isJLtType && isLtSize;
      },
      firstSuccess(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          if (width == 360 && height == 484) {
            self.courseForm.imgUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 360*484!')
          }
        };
      },
      firstSuccess2(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;
          if (width == 750 && height == 544) {
            self.courseForm.backGroundUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*544!')
          }
        };
      },
      firstSuccess3(res, file) {
        const self = this;

        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;

          if (width == 750 && height == 544) {
            self.courseSearchForm.imgUrl = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*544!')
          }
        };
      },
      // firstSuccess4(res, file) {
      //   const self = this;

      //   const image = new Image();
      //   image.src = 'https:' + res.data.fileUrl;
      //   image.onload = function () {
      //     const width = image.width;
      //     const height = image.height;

      //     if (width == 300 && height == 300) {
      //       self.courseSearchForm.iconUrl = 'https:' + res.data.fileUrl;
      //     } else {
      //       self.$message.error('上传图片的尺寸必须为 300*300!')
      //     }
      //   };
      // },
      getAllCourse(title){
        let params ={
          title:title
        }
        this.$http.get('/course/all',qs.stringify(params)).then(res =>{
          let resp = res.data;
          if (resp.success) {
            this.courseList = resp.data;
          } else {
            let msg = resp.desc || '编辑失败'
            this.$message.error(msg)
          }
        })
      },
      getCourseDetail(row){
        this.$http.get('/read/book/course/detail?id='+row.id + '&readId=' + this.readId + '&courseId=' + row.courseID).then(res =>{
          let resp = res.data;
          console.log(resp.data.courseId)
          if (resp.success) {
             this.courseSearchForm.selectType = resp.data.courseId
             this.courseSearchForm.imgUrl = resp.data.imgUrl
             // this.courseSearchForm.iconUrl = resp.data.iconUrl
             this.courseSearchForm.shareDocument = resp.data.shareDocument
             this.courseId = resp.data.courseId;
             this.content1 = resp.data.content1;
             this.content2 = resp.data.content2;
             this.content3 = resp.data.content3;
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      editCourse(title,row) {
        this.activeType = '模板一'
        this.tabId = 1
        this.courseSearchForm.selectType = ''
        this.courseSearchForm.imgUrl= ''
        // this.courseSearchForm.iconUrl= ''
        this.courseSearchForm.shareDocument= ''
        this.courseEditId = row.id;
        this.editDiolog = true ;
        this.digType = title;
        this.digTite = title == 1?'编辑':'添加' ;
        if(title==1){
          console.log(row)
          this.courseDay = row.dayNum;
          this.getCourseDetail(row)
        }else{
          this.courseDay = row.lastDayNum+1;
          this.content1 = '';
          this.content2 = '';
          this.content3 = '';
        }
        this.getAllCourse(row.courseTitle)

      },
      subCourse(){
        let params = {
          courseId:this.courseSearchForm.selectType,
          imgUrl:this.courseSearchForm.imgUrl,
          // iconUrl: this.courseSearchForm.iconUrl,
          shareDocument: this.courseSearchForm.shareDocument,
          content1: this.content1,
          content2: this.content2,
          content3: this.content3,
        }

        if(this.digType==1){
          params.id = this.courseEditId;
          params.readId = this.readId;
          params.courseId = this.courseId;
          console.log('编辑')
          this.$http.post("/read/book/course/edit",qs.stringify(params)).then(res =>{
            let resp = res.data;
            if (resp.success) {
              this.$message.success('编辑成功');
              this.editDiolog = false;
              this.getData();
            } else {
              let msg = resp.desc || '编辑失败'
              this.$message.error(msg)
            }
          })
        }else{
          console.log('新增')

          params.readId = this.readId;
          params.bookId =this.courseEditId;
          this.$http.post("/read/book/course/add",qs.stringify(params)).then(res =>{
            let resp = res.data;
            if (resp.success) {
              this.$message.success('编辑成功');

              this.editDiolog = false;

              this.getData();
            } else {
              let msg = resp.desc || '编辑失败'
              this.$message.error(msg)
            }
          })
        }
      },
      // 分页请求
      pageChange (currentPage) {
        this.pageOption.pageNum = currentPage
        this.getData()
      },
      // 保存书籍
      saveBook () {
        let params =  this.courseForm;

        params = {...params, ...this.booksForm}

        params.simpleAudition = this.fileSrc
        params.readId = Number(this.readId);
        this.$refs['courseForm'].validate((valid)=>{
          if (valid) {
            this.loading = true;
            if (this.bookType!=1) {
              params.id = this.bookId;
              this.$http.post('/read/book/save',params).then(res => {
                let resp = res.data
                if (resp.success) {
                  this.$message.success('编辑成功');
                  this.loading = false;
                  this.bookDiolog = false;
                  this.getData()
                } else {
                  this.loading = false;
                  let msg = resp.desc || '编辑失败'
                  this.$message.error(msg)
                }
              })
            } else {
              delete(params.id)
              this.$http.post('/read/book/save',params).then(res => {
                let resp = res.data
                if (resp.success) {
                  this.$message.success('新增成功');
                  this.getData()
                  this.loading = false;
                  this.bookDiolog = false;
                } else {
                  this.loading = false;
                  let msg = resp.desc || '新增失败'
                  this.$message.error(msg)
                }
              })
            }
          } else {
            return false
          }
        })
      },

      getDirectTransmission() {
          getDirectTransmissionSign().then(res => {
              const self = this;
              if (res.success) {
                  this.directTransmissionSign = res.data;
                  // 实例化一个plupload上传对象
                  var multipart_params = this.directTransmissionSign;

                  this.uploader = new plupload.Uploader({
                      runtimes: 'html5,flash,silverlight,html4',
                      browse_button: 'selectfiles',
                      url: 'http://youfen.oss-cn-hangzhou.aliyuncs.com/',
                      multipart_params: {
                          'key': multipart_params.dir + new Date().getTime(),
                          'policy': multipart_params.policy,
                          'OSSAccessKeyId': multipart_params.accessid,
                          'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                          'signature': multipart_params.signature,
                      },
                  })

                  this.uploader.init();

                  this.uploader.bind('FilesAdded', (upload, files) => {
                      if (files[files.length - 1].type != "audio/mp3" && files[files.length - 1].type != "audio/x-m4a") {
                          self.$message.error("请上传mp3或者m4a格式文件");
                          this.uploader.removeFile(files);
                          return false
                      }
                      if (files[files.length - 1].size >500000000) {
                          self.$message.error("文件过大！文件大小必须500M以内");
                          this.uploader.removeFile(files);
                          return false
                      }

                      self.fileText = files[files.length - 1].name;
                      self.booksForm.uploadFile.name = files[files.length - 1].name;
                      self.booksForm.uploadFile.url = this.uploader.settings.multipart_params.key;
                      this.uploader.start();
                  });
                  this.uploader.bind('uploadProgress', (upload, files) => {
                      self.fileText = `已完成${files.percent}%`;
                  });
                  this.uploader.bind('uploadComplete', (upload, files) => {
                      const key = this.uploader.settings.multipart_params.key;

                      if(upload.total.uploaded <=0) {
                          self.fileText = '';
                          self.$message.error("文件上传失败，请重新上传");
                          return
                      }
                      this.uploader.settings.multipart_params.key = multipart_params.dir + new Date().getTime();
                      self.fileText = files[files.length - 1].name;
                      self.booksForm.uploadFile.name = files[files.length - 1].name;
                      self.getCdnFileUrlFc(key);
                  });

              } else {
                  let msg = res.desc || '获取上传路径失败'
                  this.$message.error(msg)
              }
          }).catch(() => {
              this.$message.error('网络错误')
          })
      },

      getCdnFileUrlFc(fileKey) {
        getCdnFileUrl({
          fileKey
        }).then(res => {
          if (res.success) {
            this.fileSrc = res.data;
            this.getAudioLength();
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
        }).catch(() => {
        })
      },

      clearCourseForm(){
        for (let i in this.booksForm) {
          this.booksForm[i] = null
        }
        this.booksForm.uploadFile = {};
        this.booksForm.freeTime = 120;
        this.booksForm.courseType = 1;
        this.fileText = null;
      },

      getAudioLength() {
        const myAudio = document.getElementsByTagName('audio')[0];
        myAudio.addEventListener("canplay", function () {
            this.courseForm.timeLength = Math.round(myAudio.duration);
            console.log(myAudio.duration);
          }.bind(this)
        );
      },

      createUploader(){
        // this.getDirectTransmission()
      },
      destroyUploader(){
        // this.uploader.destroy()
      },
    }
  }
</script>
<style lang="less" >
  .ofa-main-wrap {
    .el-textarea{
      .el-textarea__inner{
      height: 200px;
    }
    }
    
    .removeDefStyle{
      .el-table .cell{
        display: block !important;
      }
      .el-table td, .el-table th{
        padding:0;
        text-align:center;
        min-height:40px;
        line-height:40px;
      }
      .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
        padding-left:0;
        min-height:50px;
        line-height:50px;
      }
      .el-table .cell, .el-table th div{
        padding-right:0;
      }
      .itemStyle{
        border-bottom:1px solid #ebeef5;
      }
      .itemStyle:last-child{
        border:0
      }
    }

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
    .table-headimg {
      height: 50px;
      width: 50px;
      display: inline-block;
      vertical-align: middle;
    }

    .avatar-uploader {
      position: relative;
      .el-upload {
        cursor: none !important;
      }
      .el-icon-plus {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .el-icon-plus:hover {
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
      .el-upload__tip, .el-button {
        position: absolute;
        left: 280px;
        top: 0;
      }
      .el-upload__tip {
        top: 30px;
      }
    }

      .audio-content {
          overflow: hidden;
          button {
            // left: 390px;
          }
      }
  }
  .doc-tips{
    font-size: 10px;
    padding-left: 80px;
    margin-top: -14px;
  }
</style>
