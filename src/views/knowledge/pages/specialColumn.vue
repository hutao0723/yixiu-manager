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
    <div class="content" v-show="pageType == 0">
      <div class="search-bar">
            <el-button type="primary" @click="newcolumnForm" size="small" class="fr">新建专栏</el-button>
        <template>
          <el-form :inline="true" :model="columnSearchForm" class="demo-form-inline" size="small">
              <el-form-item>
                <el-select v-model="columnSearchForm.selectType" class="w150 iptl">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="columnSearchForm.searchValue" class="iptr"></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="columnSearchForm.status" class="w150">
                  <el-option v-for="item in specialStateOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="columnSearchForm.searchTeacherType" class="w150 iptl">
                  <el-option v-for="item in searchTeacherTypeOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="columnSearchForm.lecturerValue" class="iptr"></el-input>
              </el-form-item>
            <el-button type="primary" @click="getColumnListData" size="small">查询</el-button>
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
              <template slot-scope="scope">
                {{scope.row.price/100}}
              </template>
            </el-table-column>
            <el-table-column prop="courseNum" label="课程数量">
              <template slot-scope="scope">
                {{scope.row.courseRelated+'/'+scope.row.courseNum}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="专栏状态" :formatter="getStatus"></el-table-column>
            <el-table-column label="操作" width="300">
              <template slot-scope="scope">
                <!--openDialogAdmin(scope.row.managerName,scope.row.id）-->
                <el-button type="text" size="mini" @click="getCourseDetail(scope.row.id)">编辑</el-button>
                <el-button type="text" size="mini" @click="getColumnManageListData(scope.row.id)">课程管理</el-button>
                <el-button type="text" size="mini" @click="changeStatus(scope.row.id,scope.row.status)">
                  {{scope.row.status == 1 ? '下线' : '上线'}}
                </el-button>
                <el-button type="text" size="mini" @click="deleteItem(scope.row.id)" :disabled="false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="10" :current-page.sync="columnSearchForm.pageNum"
                       @current-change="getColumnListData"
                       layout="total, prev, pager, next"
                       :total="totalSize"></el-pagination>
      </div>
    </div>
    <div class="content" v-show="pageType == 3">
      <div class="tabel-wrap">
        <template>
          <el-button type="primary" @click="linkCouseData" class="link-columm" size="mini">关联课程</el-button>
          <table class="" v-if="columnManageList">
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
                                 @click="changeWatchableStatus(item.id,item.watchable)">
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
    <div class="content " v-show="pageType != 3 && pageType != 0">
      <el-form :model="columnForm" :rules="rules" ref="columnForm" label-width="100px" class="column-uleForm">
        <el-form-item label="专栏标题" prop="title">
          <el-input v-model="columnForm.title" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="专栏副标题" prop="subTitle">
          <el-input v-model="columnForm.subTitle" placeholder="1-30字，建议14字以内" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="课程封面">
          <el-upload
            class="avatar-uploader"
            action="/upload/image"
            name="imageFile"
            :show-file-list=false
            :on-success="firstSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="columnForm.lateralCover" :src="columnForm.lateralCover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">{{columnForm.lateralCover ? '修改文件' : '选择文件'}}</el-button>
            <div slot="tip" class="el-upload__tip">750*545,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            action="/upload/image"
            name="imageFile"
            :show-file-list=false
            :on-success="secondSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="columnForm.verticalCover" :src="columnForm.verticalCover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-button size="small" type="primary">{{columnForm.verticalCover ? '修改文件' : '选择文件'}}</el-button>
            <div slot="tip" class="el-upload__tip">360*484,支持jpg、png、gif格式,最大5M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="专栏详情" prop="detail">
          <div id="editorElem" style="text-align:left"></div>
        </el-form-item>
        <el-form-item label="课程期数" prop="courseNum">
          <el-col :span="6">
            <el-input v-model="columnForm.courseNum" placeholder="1-999" type="number" :maxlength="3">
              <template slot="append">期</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师" prop="lecturerId">
          <el-col :span="6">
            <el-select
              v-model="columnFormLecturerId"
              filterable
              remote
              reserve-keyword
              :disabled="pageType==2"
              @keyup.native="searchLecturer"
            >
              <el-option
                v-for="item in lecturerOptions"
                :key="item.nickName"
                :label="item.nickName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="专栏价格" prop="price">
          <el-col :span="6">
            <el-input v-model="columnForm.price" placeholder="0.00-99999.99" type="number" :maxlength="8">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="讲师抽成" prop="rate">
          <el-col :span="6">
            <el-input v-model="columnForm.rate" placeholder="0.00-100.00" type="number" :maxlength="5">
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('columnForm')">保存</el-button>
          <el-button @click="cancelForm('columnForm')">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
    <el-dialog title="关联课程" :visible.sync="linkVisable">
      <el-form :inline="true" :model="linkcolumnForm" class="demo-form-inline" size="medium">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="linkcolumnForm.selectType">
              <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
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
        <el-button type="primary" @click="getLinkCourseData" size="mini" class="min-search">查询</el-button>
        <el-table
          ref="multipleTable"
          :data="linkcolumnList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick">
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
          <el-pagination background :page-size="20" :current-page.sync="linkcolumnForm.pageNum"
                         @current-change="getLinkCourseData"
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
  import E from 'wangeditor'

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
  } from '@/api/index'

  export default {
    components: {
      draggable
    },
    data() {
      var priceRule = (rule, value, callback) => {
        if(String(value).indexOf('.') !=-1 && String(value).split('.')[1].length >2){
          callback(new Error('最多两位小数'));
        }else{
          if(value> 99999.99 || value <0){
            callback(new Error('价格区间在0.00-99999.99之间'));
          } else{
            callback()
          }
        }

      };

      var rateRule = (rule, value, callback) => {
        if(String(value).indexOf('.') !=-1 && String(value).split('.')[1].length >2){
          callback(new Error('最多两位小数'));
        }else{
          if(value > 100 || value <0){
            callback(new Error('抽成比例在0.00-100.00之间'));
          } else{
            callback()
          }
        }
      };

      var courseNumRule = (rule, value, callback) => {
        if(/^\d+\.\d+$/.test(String(value))){
          callback(new Error('不可以为小数'));
        }else{
          if(value > 999){
            callback(new Error('最大值为999'));
          }else{
            if(value < 1){
              callback(new Error('最小值为1'));
            }else{
              callback()
            }
          }
        }
      };
      return {
        editorContent:null,
        loading: false,
        pageType: 0,
        searchOptions: [
          {
            value: 'title',
            label: '专栏标题'
          }, {
            value: 'id',
            label: '专栏ID'
          }],
        courseOptions: [
        {
          value: 'title',
          label: '课程标题'
        }, {
          value: 'id',
          label: '课程ID'
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

        columns: [
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
        totalSize: null,
        columnList: [],

        //分页查询课程信息
        columnSearchForm: {
          selectType: 'title',
          searchValue: null,
          specialState: '',
          searchTeacherType: 'lecturerNickName',
          id: null,
          title: null,
          status: '',
          lecturerId: null,
          lecturerNickName: null,
          lecturerValue: null,
          pageNum: 1,
          pageSize: 10,
        },

        //新增编辑专栏form表单
        columnForm: {
          id: null,
          title: null,
          subTitle: null,
          introduction: null,
          lateralCover:null,
          verticalCover:null,
          detail: null,
          price: null,
          rate: null,
          lecturerId: null,
          lecturerName:null,
          courseNum: null
        },
        rules: {
          title: [
            {required: true, message: '请输入专栏标题', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          subTitle: [
            {required: true, message: '请输入专栏副标题', trigger: 'blur'},
            {min: 1, max: 30, message: '长度在 1 到 30 个字', trigger: 'blur'}
          ],
          detail: [
            {required: true, message: '请输入专栏详情', trigger: 'blur'},
          ],
          courseNum: [
            {required: true, message: '请输入课程期数', trigger: 'blur'},
            {validator: courseNumRule, trigger: 'blur' }
          ],
          price: [
            {required: true, message: '请输入专栏价格', trigger: 'blur'},
            {validator: priceRule, trigger: 'blur' }
          ],
          rate: [
            {required: true, message: '请输入讲师抽成', trigger: 'blur'},
            {validator: rateRule, trigger: 'blur' },
          ],

        },

        //课程管理
        columnManageList: [],
        manageListId: null,

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
          pageNum: 1,
          pageSize: null,
          totleSize: null,
          columnId:null
      },

        //勾选关联课程
        linkForm: {
          columnId: '',
          subCourses: [], //临时集合
          courses: []
        },
        linkFormColumnId:null
      }
    },
    computed: {
      columnFormLecturerId: {
        get: function () {
          if(this.pageType==2){
            return this.columnForm.lecturerName
          }
          return this.columnForm.lecturerId
        },
        set: function (newValue) {
          this.columnForm.lecturerId = newValue
        }
      },
    },
    created() {
      this.getColumnListData();
    },
    methods: {
      creatRichText(res){
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
        editor.customConfig.$initContent ='';
        editor.customConfig.onchange = (html) => {
          const content = html=='<p><br></p>'?'':html;
          this.columnForm.detail = content;
        }
        editor.create()
        editor.txt.clear();
        editor.txt.html(res || null)
      },

      priceFilter(data){
        if(/^\d+\.\d+$/.test(String(data.columnForm.price))) {
          this.columnForm.price = Number(String(this.columnForm.price).split('.')[0])
        }
      },

      rateFilter(data){
        if(/^\d+\.\d+$/.test(String(data.columnForm.rate))) {
          this.columnForm.rate = Number(String(this.columnForm.rate).split('.')[0])
        }
      },
      getCourseDetail(id) {
        this.loading = true;
        this.clearColumnForm();
        this.columnForm.id = id;
        getColumn({id}).then(res => {
          if (res.success) {
            this.columnForm = Object.assign({},this.columnForm,res.data);
            this.columnForm.price = this.columnForm.price/100;
            this.columnForm.rate = this.columnForm.rate/100;
            this.creatRichText(this.columnForm.detail)
            this.pageType = 2; //1 新增 2 编辑
          } else {
            let msg = res.desc || '获取课程内容失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({},this.columnForm);
            params.price = this.columnForm.price*100;
            params.rate = this.columnForm.rate*100;
            if (this.columnForm.id) {
              updateColumn(params).then(res => {
                if (res.success) {
                  this.$message.success('修改成功')
//                  this.clearColumnSearchForm();
                  this.pageType = 0;
                  this.getColumnListData();
                } else {
                  let msg = res.desc || '请求失败'
                  this.$message.error(msg);
                }
                this.loading = false;
              }).catch(() => {
                this.loading = false;
              })
            } else {
              addColumn(params).then(res => {
                if (res.success) {
                  this.$message.success('新增成功')
//                  this.clearColumnSearchForm();
                  this.getColumnListData();
                  this.pageType = 0;

                } else {
                  let msg = res.desc || '请求失败'
                  this.$message.error(msg);
                }
                this.loading = false;
              }).catch(() => {
                this.loading = false;
              })
            }

          } else {
            console.log('数据未填写完整');
            return false;
          }
        });
      },

      cancelForm(formName) {
        this.$refs[formName].resetFields();
//        this.clearColumnSearchForm();
        this.getColumnListData();
        this.pageType = 0;
      },

      getCourseType(row, column) {
        return row.courseType == 1 ? '音频' : '视频'
      },

      getStatus(row, column) {
        switch (row.status) {
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

      submitlinkForm() {
        this.loading = true;
        this.linkForm.columnId = this.linkFormColumnId;
        relateCourse(this.linkForm).then(res => {
          if (res.success) {
            this.$message.success('关联成功');
            this.clearLinkcolumnForm();
            this.linkVisable = false;
            this.getColumnManageListData();
            this.getColumnListData();
          } else {
            let msg = res.desc || '关联失败';
            this.clearLinkcolumnForm();
            this.linkVisable = false;
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      cancelLinkForm() {
        this.clearLinkcolumnForm();
        this.linkVisable = false;
      },

      //多选
      handleSelectionChange(val) {
        this.linkForm.courses = val;
      },

      handleRowClick(row,event,column) {
        this.$refs.multipleTable.toggleRowSelection(row)
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
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      async linkCouseData(){
        await this.getLinkCourseData();
        this.linkVisable = true;
      },

      //设为试看
      changeWatchableStatus(relationId, changeStatus) {
        this.loading = true;
        const status = Number(!changeStatus);
        updateWatchStatus({
          relationId,
          status
        }).then(res => {
          if (res.success) {
            this.$message.success('切换状态成功');
            this.getColumnManageListData();
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
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
            this.getColumnManageListData();
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      //课程管理列表
      getColumnManageListData(columnId) {
        this.manageListId = columnId || this.manageListId;
        this.linkFormColumnId = columnId || this.linkFormColumnId;
        this.linkcolumnForm.columnId = columnId || this.linkFormColumnId;
        this.loading = true;
        getLinkCourse(
          {columnId: this.manageListId}
        ).then(res => {
          if (res.success) {
            this.columnManageList = res.data;
            this.pageType = 3;
          } else {
            let msg = res.data.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
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
          }).catch(() => {
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
      changeStatus(id, changeStatus) {
        this.loading = true;
        const status = changeStatus % 2 == 0 ? 1 : 2;
        updateStatusColumn({
          id,
          status
        }).then(res => {
          if (res.success) {
            this.$message.success('切换成功');
            this.getColumnListData();
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
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
        }).catch(() => {
          this.loading = false;
        })
      },

      getLecturerList(nickName) {
        this.loading = true;
        lecturerList({
          nickName
        }).then(res => {
          if (res.success) {
            this.lecturerOptions = res.data;
          } else {
            let msg = res.desc || '请求失败'
            this.$message.error(msg)
          }
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      searchLecturer(selectVal){
        if(selectVal.target.value == ''){
          this.columnFormLecturerId = ''
        }
        this.getLecturerList()
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
          if (width == 750 && height == 545) {
            self.columnForm.lateralCover = 'https:' + res.data.fileUrl;
          } else {
            self.$message.error('上传图片的尺寸必须为 750*545!')
          }
        };
      },
      secondSuccess(res, file) {
        const self = this;
        const image = new Image();
        image.src = 'https:' + res.data.fileUrl;
        image.onload = function () {
          const width = image.width;
          const height = image.height;

          if (width == 360 && height ==484) {
            self.columnForm.verticalCover = 'https:' + res.data.fileUrl
          } else {
            self.$message.error('上传图片的尺寸必须为 360*484!')
          }
        };
      },

      newcolumnForm() {
        this.clearColumnForm();
        this.getLecturerList();
        this.creatRichText()
        this.pageType = 1;
      },



      datadragEnd(e) {
        let columnId = this.columnManageList[0] && this.columnManageList[0].columnId;
        let id = +this.columnManageList[e.newIndex].id
        let initPosition = +this.columnManageList[e.newIndex].relationSort
        let movedPosition = e.newIndex > e.oldIndex ? +(this.columnManageList[e.newIndex - 1].relationSort) : +(this.columnManageList[e.newIndex + 1].relationSort)
        this.loading = true;
        courseSort({columnId, id, initPosition, movedPosition,}).then(res => {
          if (res.success) {
            this.getColumnManageListData();
          } else {
            let msg = res.desc || '排序失败'
            this.$message.error(msg)
          }
        }).catch(() => {
          this.$message.error('网络错误')
        })
      },

      clearColumnForm(){
        for (let i in this.columnForm) {
          this.columnForm[i] = null
        }
      },

      clearColumnSearchForm(){
        for (let i in this.columnSearchForm) {
          this.columnSearchForm[i] = null
        }
        this.columnSearchForm.selectType= 'title',
        this.columnSearchForm.status='',
        this.columnSearchForm.searchTeacherType= 'lecturerNickName',
        this.columnSearchForm.pageNum=1,
        this.columnSearchForm.pageSize= 10
      },

      clearLinkcolumnForm(){
        for (let i in this.linkcolumnForm) {
          this.linkcolumnForm[i] = null
        }
        this.linkcolumnForm.selectType= 'title',
        this.linkcolumnForm.searchTeacherType= 'lecturerNickName',
        this.columnSearchForm.pageNum=1,
        this.columnSearchForm.pageSize= 10
      },
    }
  }

</script>
<style lang="less" scoped>
  .ql-container {
    min-height: 200px !important;
  }

.min-search{
  vertical-align: -webkit-baseline-middle;
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
      .el-upload__tip, .el-button {
        position: absolute;
        left: 200px;
        top: 0;
      }
      .el-upload__tip {
        top: 30px;
      }
    }
  }
</style>
