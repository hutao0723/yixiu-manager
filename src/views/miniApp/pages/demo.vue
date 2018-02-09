<template>
  <section class="app-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>小程序</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="add-ofa">
        <i class="iconfont icon-jia"></i>
        <span class="offical-acount">小程序</span>
      </span>
    </div>
    <div class="content">
      <div class="tabel-wrap">
        <template>
          <el-table :data="tableData"  style="width: 100%" >
              <el-table-column prop="id" label="ID" width="80"></el-table-column>
              <el-table-column label="小程序" >
                <template slot-scope="scope">
                  <img :src="scope.row.headImg" class="app-avatar">
                  <span class="app-name">{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" >
                <template slot-scope="scope">
                  {{formatDateNew(scope.row.gmtCreate)}}
                </template>
              </el-table-column>
              <el-table-column prop="authorized" label="是否授权">
                <template slot-scope="scope">
                  {{scope.row.authorized ? '是' : '否'}}
                </template>
              </el-table-column>
              <el-table-column  label="操作" width="500">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="getDetail(scope.row.id)">详情</el-button>
                  <el-button type="text" size="mini" >授权</el-button>
                  <el-button type="text" size="mini">域名配置</el-button>
                  <router-link :to="{ path: '/manager/miniApp/codeMng/' + scope.row.appId }">
                    <el-button type="text" size="mini">代码管理</el-button>
                  </router-link>
                  <router-link :to="{ path: '/manager/miniApp/templateMsg/' + scope.row.appId}">
                    <el-button type="text" size="mini">模板消息</el-button>
                  </router-link>
                  <el-button type="text" size="mini">删除</el-button>               
                </template>
              </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="appdetail-diolog">
        <el-dialog title="小程序基本信息" :visible.sync="appdetailDialog.show" width="600px">
          <el-form label-position="left" size="mini">
            <el-form-item label="名称:" :label-width="appdetailDialog.formLabelWidth">
              <span>{{appDetail.nickName}}</span>
            </el-form-item>
            <el-form-item label="头像:" :label-width="appdetailDialog.formLabelWidth">
              <img :src="appDetail.headImg" class="app-avatar">
            </el-form-item>
            <el-form-item label="主体信息:" :label-width="appdetailDialog.formLabelWidth">
              <span>{{appDetail.principalName}}</span>
            </el-form-item>
            <el-form-item label="微信认证:" :label-width="appdetailDialog.formLabelWidth">
              <span>{{appDetail.serviceTypeInfo === 0 ? '已认证' : '未认证'}}</span>
            </el-form-item>
             <el-form-item label="原始Id:" :label-width="appdetailDialog.formLabelWidth">
              <span>{{appDetail.userName}}</span>
            </el-form-item>     
             <el-form-item label="appId:" :label-width="appdetailDialog.formLabelWidth">
              <span>{{appDetail.appId}}</span>
            </el-form-item> 
          </el-form>
        </el-dialog>
      </div>
    </div>
    <div class="temp-selected">
        <draggable v-model="keywordSelected">
            <transition-group>
                <div class="item" v-for="(item, index) in keywordSelected" :key="item.keywordId" >
                  <el-checkbox v-model="item.checked" >{{ item.name }}</el-checkbox>
                </div>
            </transition-group>
        </draggable>
    </div>
  </section>
</template>


<script>
import { formatDateNew } from '../../../utils/dateUtils';
import draggable from 'vuedraggable'
export default {
  components: {
  　　draggable
  },
  data() {
    return {
      appDetail:{},
      appdetailDialog : {
        show: false,
        formLabelWidth: '100px'
      },
      keywordSelected:[],
      keywordList: [],
      tableData: [],
      totalSize:2
      }
  },
  computed: {
    keywordSelecting () {
      let keywordSelecting = [];
       console.log("computed");
      this.keywordList.forEach(function (item) { 
         if (item.checked) keywordSelecting.push(item);
       // console.log(keywordSelecting)
      })
      return keywordSelecting;
    }
  },
  watch: {
    keywordSelecting (val) {
       console.log("watch");
      this.keywordSelected = val;
      console.log(val)
    }
  },
  created () {
    this.getCheckBoxData()
    this.keywordSelected = this.keywordSelecting;
    this.getAppList()
  },
  methods: {
    formatDateNew: formatDateNew,
    getAppList () {
      this.$http.get('/miniapp/list').then(res => {
        let resp = res.data;
        if(resp.success){
            this.tableData = resp.data.lists;
            this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    getCheckBoxData(){
      this.$http.get('/miniapp/demo').then(res => {
        let resp = res.data;
        if(resp.success){
            this.keywordList = resp.list;
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    getDetail (id){
      this.appdetailDialog.show = true;
      this.$http.get('/miniapp/detail', {params: {id}}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.appDetail = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.app-main-wrap {
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
  .search-bar {
    margin-top: 20px;
  }
  .tabel-wrap {
    .app-avatar{
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      float: left;
    }
    .app-name{
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }

  }
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
  .appdetail-diolog, .domain-diolog{
    .el-dialog__body{
      overflow: hidden;
      span {
        display: block;
      }       
    }
  }
   .app-avatar{
      width: 40px;
      height: 40px;
      line-height: 40px;
      display: inline-block;
      float: left;
    }
}
</style>
