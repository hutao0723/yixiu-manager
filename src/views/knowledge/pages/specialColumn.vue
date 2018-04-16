<template>
  <section class="ofa-main-wrap" v-loading="loading">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/specialColumn' }"><span @click="pageType = 0">专栏</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageType == 1">新增专栏</el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageType == 2">编辑专栏</el-breadcrumb-item>
        <el-breadcrumb-item v-if="pageType == 3">课程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content" v-if="pageType == 0">
      <div class="search-bar">
        <template>
          <el-form :inline="true" :model="columnSearchForm" class="demo-form-inline" size="mini">
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="columnSearchForm.selectType">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="columnSearchForm.searchValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="columnSearchForm.specialState">
                  <el-option v-for="item in specialStateOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-select v-model="columnSearchForm.searchTeacherType">
                  <el-option v-for="item in searchTeacherTypeOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="columnSearchForm.lecturerValue"></el-input>
              </el-form-item>
            </el-col>
            <el-button type="primary" @click="getColumnListData" size="mini">查询</el-button>
            <el-button type="primary" @click="newcolumnForm" size="mini">新建专栏</el-button>
          </el-form>
        </template>
      </div>
      <div class="tabel-wrap">
        <template>
          <el-table :data="columnList" style="width: 100%">
            <el-table-column prop="id" label="专栏ID">
            </el-table-column>
            <el-table-column prop="title" label="专栏标题">
            </el-table-column>
            <el-table-column prop="price" label="专栏价格">
            </el-table-column>
            <el-table-column prop="courseNum" label="课程数量">
            </el-table-column>
            <el-table-column prop="status" label="专栏状态" :formatter="getStatus"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!--openDialogAdmin(scope.row.managerName,scope.row.id）-->
                <el-button type="text" size="mini" @click="getCourseDetail(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="getColumnManageListData(scope.row.id)">课程管理</el-button>
                <el-button type="text" size="mini" @click="changeStatus(scope.row.id,scope.row.status)">
                  {{scope.row.id == 1 ? '上线' : '下线'}}
                </el-button>
                <el-button type="text" size="mini" @click="deleteItem(scope.row.id)" :disabled="false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="20" :current-page.sync="pageOption.pageNum" @current-change="getColumnListData"
                       layout="total, prev, pager, next"
                       :total="totalSize"></el-pagination>
      </div>
    </div>
    <div class="content" v-else-if="pageType == 3">
      <div class="tabel-wrap">
        <template>
          <el-button type="primary" @click="getLinkCourseData" class="link-columm" size="mini">关联课程</el-button>
          <table class="" v-if="columnManageList" >
            <thead>
            <tr class="tr-header">
              <template v-for="column in columns">
                <th v-bind:class="column.className" v-bind:style="{width: column.width + '%'}">
                  {{column.title}}
                </th>
              </template>
            </tr>
            </thead>
            <draggable v-model="columnManageList" :element="'tbody'" @update="datadragEnd">
              <tr class="tr-items" v-for="(item, index) in columnManageList" :key="item.id">
                <template v-for="column in columns">
                  <template v-if="column.action">
                    <td>
                      <el-button type="text" size="mini"
                      @click="changeWatchableStatus(item.columnId,item.watchable)">
                      {{item.watchable == 0 ? '设为试看' : '取消试看'}}
                      </el-button>
                      <el-button type="text" size="mini" @click="removeCulum(item.id)" :disabled="false">移除</el-button>
                    </td>
                  </template>
                  <template v-else>
                    <td v-if="column.render" v-bind:style="{width: column.width + '%'}">
                      {{column.render(item[column.dataIndex] || '', item, index)}}
                    </td>
                    <td v-else v-bind:style="{width: column.width + '%'}">
                      {{item[column.dataIndex]}}
                    </td>
                  </template>
                </template>
              </tr>
            </draggable>
          </table>
        </template>
      </div>
    </div>
    <div class="content " v-else>
      <el-form :model="columnForm" :rules="rules" ref="columnForm" label-width="100px" class="column-uleForm">
        <el-form-item label="专栏标题" prop="title">
          <el-input v-model="columnForm.title" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="专栏副标题" prop="subTitle">
          <el-input v-model="columnForm.subTitle" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="专栏简介" prop="introduction">
          <el-input v-model="columnForm.introduction" placeholder="1-45个字"></el-input>
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            class="avatar-uploader"
            action="http://youfen.oss-cn-hangzhou.aliyuncs.com/"
            :data="directTransmissionSign"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="columnForm.coverList[0]" :src="columnForm.coverList[0].url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">750*560,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action="http://youfen.oss-cn-hangzhou.aliyuncs.com/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="columnForm.coverList[1]" :src="columnForm.coverList[1].url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">750*xxx,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="专栏详情" prop="detail">
          <quill-editor v-model="columnForm.detail"></quill-editor>
        </el-form-item>
        <el-form-item label="课程期数" prop="courseNum">
          <el-col :span="4">
            <el-input v-model="columnForm.courseNum">
              <template slot="append">期</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师" prop="lecturerId">
          <el-col :span="4">
            <el-select
              v-model="columnForm.lecturerId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="getLecturerList"
              >
              <el-option
                v-for="item in lecturerOptions"
                :key="item.id"
                :label="item.nickName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="专栏价格" prop="price">
          <el-col :span="4">
            <el-input v-model="columnForm.price">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师抽成" prop="rate">
          <el-col :span="4">
            <el-input v-model="columnForm.rate">
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('columnForm')">保存</el-button>
          <el-button @click="cancelForm('columnForm')">取消</el-button>
        </el-form-item>
      </el-form>
        <div id="container"></div>
      <el-button id="selectfiles">选择文件</el-button>
      <el-button id="start_upload">文件开始上传</el-button>
    </div>
    <el-dialog title="关联课程" :visible.sync="linkVisable">
      <el-form :inline="true" :model="linkcolumnForm" class="demo-form-inline" size="medium">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="linkcolumnForm.selectType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input v-model="linkcolumnForm.searchValue"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="linkcolumnForm.searchTeacherType">
              <el-option v-for="item in searchTeacherTypeOption" :key="item.value" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input v-model="linkcolumnForm.lecturerValue"></el-input>
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="getLinkCourseData" size="mini">查询</el-button>
        <el-table
          ref="multipleTable"
          :data="linkcolumnList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="100">
          </el-table-column>
          <el-table-column
            label="课程ID"
            width="150">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column
            prop="courseType"
            label="课程类型"
            width="150"
            :formatter="getCourseType">
          </el-table-column>
          <el-table-column
            prop="title"
            label="课程标题"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div class="page-control">
          <el-pagination background :page-size="2" :current-page.sync="linkcolumnForm.pageOption.pageNum" @current-change="getLinkCourseData"
                         layout="total, prev, pager, next"
                         :total="linkcolumnForm.totalSize"></el-pagination>
        </div>
        <el-col :span="5" :offset="19" class="mt20">
          <el-button type="default" @click="cancelLinkForm" size="mini">取消</el-button>
          <el-button type="primary" @click="submitlinkForm" size="mini">保存</el-button>
        </el-col>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import draggable from 'vuedraggable'
  import {quillEditor} from 'vue-quill-editor'
  import plupload from 'plupload';
  import {
    getColumn,
    updateStatusColumn,
    pageListColumn,
    getLinkCourse,
    updateColumn,
    deleteColumn,
    addColumn,
    removeColumn,
    updateWatchStatus,
    relateCourse,
    coursePageList,
    lecturerList,
    courseSort,
    getDirectTransmissionSign
  } from '@/api/index'

  export default {
    components: {
      quillEditor,
      draggable
    },
    data() {
      return {
        loading:false,
        directTransmissionSign:null, //上传签名
        pageType: 0,
        searchOptions: [
          {
            value: 'title',
            label: '专栏标题'
          }, {
            value: 'id',
            label: '专栏ID'
          }],
        courseTypeOptions: [
          {
            value: 1,
            label: '音频'
          }
        ],
        specialStateOptions: [
//          专栏状态|待上线|已上线|已下线
          {
            value: '',
            label: '专栏状态'
          }, {
            value: '0',
            label: '待上线'
          },
          {
            value: '1',
            label: '已上线'
          }, {
            value: '2',
            label: '已下线'
          }
        ],
        lecturerOptions: [],
        searchTeacherTypeOption: [
//          讲师昵称|讲师Id
          {
            value: 'lecturerNickName',
            label: '讲师昵称'
          }, {
            value: 'lecturerId',
            label: '讲师ID'
          }
        ],

        columns :[
          {
            title: '序号',
            width: 10,
            render: (text, record, index) => {
              return index + 1
            }
          },
          {
            title: '课程ID',
            dataIndex: 'courseId',
            width: 10
          },
          {
            title: '课程类型',
            dataIndex: 'subscriptionName',
            width: 10,
            render: (text, record, index) => {
              if (record.courseType == 1) return '音频'
              if (record.courseType != 1) return '视频'
            }
          },
          {
            title: '课程标题',
            dataIndex: 'courseTitle',
            width: 30
          },
          {
            title: '课程状态',
            dataIndex: 'courseStatus',
            width: 10,
            render: (text, record, index) => {
              if (record.courseStatus === '') return '专栏状态'
              if (record.courseStatus === 0) return '待上线'
              if (record.courseStatus === 1) return '已上线'
              if (record.courseStatus === 2) return '已下线'
            }
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 10,
            action: true
          }
        ],

        pageOption: {
          pageNum: 1,
          size: 20
        },
        totalSize: 1,
        columnList: [],

        //分页查询课程信息
        columnSearchForm: {
          selectType: 'title',
          searchValue: null,
          specialState: '',
          searchTeacherType: 'lecturerNickName',
          id: null,
          title: null,
          status: null,
          lecturerId: null,
          lecturerNickName: null,
          lecturerValue: null,
          pageNum: null,
          pageSize: null,
        },

        //新增编辑专栏form表单
        columnForm: {
          title: null,
          subTitle: null,
          introduction:null,
          coverList:[],
          detail: null,
          price: null,
          rate: null,
          lecturerId: null,
          courseNum:null
        },
        rules: {
          title: [
            {required: true, message: '请输入专栏标题', trigger: 'blur'},
            {min: 1, max: 45, message: '长度在 1 到 45 个字', trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '请输入专栏简介', trigger: 'blur'},
            {min: 1, max: 200, message: '长度在 1 到 200 个字', trigger: 'blur'}
          ],
          detail: [
            {required: true, message: '请输入专栏详情', trigger: 'blur'},
          ],
          courseNum: [
            {required: true, message: '请输入课程期数', trigger: 'blur'},
          ],
          lecturerId: [
            {required: true, message: '请选择讲师', trigger: 'change'},
          ],
          price: [
            {required: true, message: '请输入专栏价格', trigger: 'blur'},
          ],
          rate: [
            {required: true, message: '请输入讲师抽成', trigger: 'blur'},
          ],

        },


        //课程管理
        columnManageList: [],

        //关联课程管理
        linkVisable: false,
        linkcolumnList: [],
        linkcolumnForm: {
          selectType: 'title',
          searchValue: null,
          specialState: '',
          searchTeacherType: 'lecturerNickName',
          id: null,
          title: null,
          lecturerId: null,
          lecturerNickName: null,
          lecturerValue: null,
          pageNum: null,
          pageSize: null,
          totleSize:null,
          pageOption: {
            pageNum: 1,
            size: 2
          },
        },

        //勾选关联课程
        linkForm:{
          columnId:'',
          subCourses:[], //临时集合
          courses:[

            {
              courseId:'',
              lecturerId:''
            }
          ]
        },
      }
    },
    created() {
      this.getColumnListData();
    },
    methods: {

      getCourseDetail(id) {
        this.loading = true;
        getColumn({id}).then(res => {
          if (res.success) {
            this.columnForm = Object.assign({}, res.data);
            this.getDirectTransmissionSign();
            this.pageType = 2; //1 新增 2 编辑
          } else {
            let msg = res.desc || '获取课程内容失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            updateColumn(this.columnForm).then(res => {
              if (res.success) {
                this.$message.success('修改成功')
                this.pageType = 0;
              } else {
                let msg = res.desc || '请求失败'
                this.$message.error(msg);
              }
              this.loading = false;
            }).catch(()=>{
              this.loading = false;
            })
          } else {
            console.log('数据未填写完整');
            return false;
          }
        });
      },

      cancelForm(formName) {
        this.$refs[formName].resetFields();
        this.pageType = 0;
      },

      getCourseType(row, column) {
        return row.courseType == 1 ? '音频' : '视频'
      },

      getStatus(row, column) {
        switch (row.status || row.courseStatus) {
          case '':
            return '专栏状态';
          case 0:
            return '待上线';
          case 1:
            return '已上线';
          case 2:
            return '已下线';
        }
      },

      submitlinkForm(){
        this.loading = true;
        relateCourse(this.linkForm).then(res => {
          if (res.success) {
            this.$message.success('关联成功')
            this.linkVisable = false;
          } else {
            let msg = res.desc || '关联失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      cancelLinkForm(){
        this.linkVisable =false;
      },

      //多选
      handleSelectionChange(val) {
        this.linkForm.subCourses = val;
        console.log(this.linkForm)
      },

      //分页查询课程信息
      getLinkCourseData() {
        console.log(this.linkcolumnForm);
        [this.linkcolumnForm.id, this.linkcolumnForm.title] = this.linkcolumnForm.selectType == 'id' ? [this.linkcolumnForm.searchValue, ''] : ['', this.linkcolumnForm.searchValue];
        [this.linkcolumnForm.lecturerNickName, this.linkcolumnForm.lecturerId] = this.linkcolumnForm.searchTeacherType == 'lecturerId' ? ['', this.linkcolumnForm.lecturerValue] : [this.linkcolumnForm.lecturerValue, ''];
        this.loading = true;
        coursePageList(this.linkcolumnForm).then(res => {
          if (res.success) {
            this.linkcolumnList = res.data.content;
            this.linkcolumnForm.totalSize = res.data.totalElements;
            this.linkVisable = true;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      //设为试看
      changeWatchableStatus(relationId, status) {
        this.loading = true;
        updateWatchStatus({
          relationId
        }).then(res => {
          if (res.success) {
            this.$message.success('切换状态成功')
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      //移除
      removeCulum(relationId) {
        this.loading = true;
        removeColumn({
          relationId
        }).then(res => {
          if (res.success) {
            this.$message.success('移除成功')
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      //课程管理列表
      getColumnManageListData(columnId) {
        this.loading = true;
        getLinkCourse(
          {columnId}
        ).then(res => {
          if (res.success) {
            this.columnManageList = res.data;
            this.linkForm.columnId = columnId;
            this.pageType = 3;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      //删除课程
      deleteItem(id) {
        this.$confirm('确认移除专栏？', '移除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true;
          deleteColumn({id}).then(res => {
            if (res.success) {
              this.$message.success('移除成功');
              this.getColumnListData();
            } else {
              let msg = res.desc || '移除失败'
              this.$message.error(msg)
            }
            this.loading = false;
          }).catch(()=>{
            this.loading = false;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          })
        })
      },

      //上下线
      changeStatus(id, status) {
        this.loading = true;
        updateStatusColumn(
          id,
          status
        ).then(res => {
          if (res.success) {
            this.$message.success('切换成功')
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      //获取专栏列表数据
      getColumnListData() {
        [this.columnSearchForm.id, this.columnSearchForm.title] = this.columnSearchForm.selectType == 'id' ? [this.columnSearchForm.searchValue, ''] : ['', this.columnSearchForm.searchValue];
        [this.columnSearchForm.lecturerNickName, this.columnSearchForm.lecturerId] = this.columnSearchForm.searchTeacherType == 'lecturerId' ? ['', this.columnSearchForm.lecturerValue] : [this.columnSearchForm.lecturerValue, ''];
        this.loading = true;
        pageListColumn(this.columnSearchForm).then(res => {
          if (res.success) {
            this.columnList = res.data.content;
            this.totalSize = res.data.totalElements;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      getLecturerList(nickName){
        this.loading = true;
        lecturerList({
          nickName
        }).then(res => {
          if (res.success) {
            this.lecturerOptions = res.data.content;
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(()=>{
          this.loading = false;
        })
      },

      beforeAvatarUpload(file) {
        const isJLtType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLtSize = file.size / 1024 <= 10000;
        if (!isJLtType) {
          this.$message.error('上传皮肤图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLtSize) {
          this.$message.error('上传皮肤图片大小不能超过 100KB!');
        }
        return isJLtType && isLtSize;
      },

      handleAvatarSuccess(res, file) {
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          if (width != 750) {
            this.courseForm.frontCover = res.data.fileUrl;
          } else {
            this.$message.error('上传图片的宽度必须为 750px!')
          }
        };
      },

      newcolumnForm(){
        for(let i in this.columnForm){
          this.columnForm[i] = null
        }
        this.columnForm.coverList=[];
        this.getLecturerList();
        this.getDirectTransmissionSign();
        this.pageType = 1;
      },

      datadragEnd (e) {
        let columnId = this.columnManageList[0] && this.columnManageList[0].columnId;
        let id = +this.columnManageList[e.newIndex].id
        let initPosition = +this.columnManageList[e.newIndex].relationSort
        let movedPosition = e.newIndex > e.oldIndex ? +(this.columnManageList[e.newIndex - 1].relationSort) : +(this.columnManageList[e.newIndex + 1].relationSort)
        this.loading = true;
        courseSort({ columnId,id,initPosition, movedPosition,}).then(res => {
          if (res.success) {
            this.getColumnManageListData();
          } else {
            let msg = res.desc || '排序失败'
            this.$message.error(msg)
          }
        }).catch(()=>{
          this.$message.error('网络错误')
        })
      },

      getDirectTransmissionSign() {

        getDirectTransmissionSign().then(res => {
          if (res.success) {
            this.directTransmissionSign = res.data;

            //        实例化一个plupload上传对象
            var multipart_params = this.directTransmissionSign;
            console.log(multipart_params);

            var uploader = new plupload.Uploader({
              runtimes : 'html5,flash,silverlight,html4',
              browse_button : 'selectfiles',
              //runtimes : 'flash',
              container: 'container',
              flash_swf_url : multipart_params.dir,
              silverlight_xap_url : multipart_params.dir,
              url : 'http://youfen.oss-cn-hangzhou.aliyuncs.com/',

              multipart_params: {
                'Filename': 'test',
                'key' : 'test',
                'policy': multipart_params.policy,
                'OSSAccessKeyId': multipart_params.accessid,
                'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                'signature': multipart_params.signature,
              },
            })

            //在实例对象上调用init()方法进行初始化
            uploader.init();

            //绑定各种事件，并在事件监听函数中做你想做的事
            uploader.bind('FilesAdded',function(uploader,files){
              //每个事件监听函数都会传入一些很有用的参数，
              //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            });
            uploader.bind('UploadProgress',function(uploader,file){
              //每个事件监听函数都会传入一些很有用的参数，
              //我们可以利用这些参数提供的信息来做比如更新UI，提示上传进度等操作
            });
            //......
            //......

            //最后给"开始上传"按钮注册事件
            document.getElementById('start_upload').onclick = function(){
              uploader.start(); //调用实例对象的start()方法开始上传文件，当然你也可以在其他地方调用该方法
            }
          } else {
            let msg = res.desc || '获取上传路径失败'
            this.$message.error(msg)
          }
        }).catch(()=>{
          this.$message.error('网络错误')
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  .ql-container {
    min-height: 200px !important;
  }

  .ofa-main-wrap {
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
    .link-columm {
      float: right;
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
      .el-upload__tip,.el-button{
        position: absolute;
        left: 200px;
        top: 0;
      }
      .el-upload__tip{
        top:30px;
      }
    }
  }
</style>
