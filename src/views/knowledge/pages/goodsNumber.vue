<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/goodsGroup' }">商品组</el-breadcrumb-item>
        <el-breadcrumb-item>商品数</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <span class="connect-ad" @click="openDialogGoods">商品</span>
      </span>
    </div>
    <div class="conbtent">
      <div class="tabel-content">
        <template>
           <table class="" v-if="tableData" >
              <thead>
                <tr class="tr-header">
                  <template v-for="column in columns">
                    <th v-bind:class="column.className" v-bind:style="{width: column.width + '%'}">
                      {{column.title}}
                    </th>
                  </template>
                </tr>
              </thead>
              <draggable v-model="tableData" :element="'tbody'" @update="datadragEnd">
                <tr class="tr-items" v-for="(item, index) in tableData" :key="item.id">
                  <template v-for="column in columns">
                    <template v-if="column.action">
                      <td>
                         <el-button type="text" size="small" @click="cancelRelation(item)">移除</el-button> 
                      </td>
                    </template>
                    <template v-else-if="column.hasUrl">
                      <td> 
                        <img :src="item[column.imgUrl]" alt="" class="goods-list-img">
                        <span v-text="item[column.dataIndex]"></span>
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

    <div class="connect-loadPage-diolog">
      <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
        <el-tabs v-model="activeType" type="card" @tab-click="handleClick" class="pad-length">
          <el-tab-pane :label="item.name" :name="item.name" v-for="(item,index) in tabList" :key="item.id"  :value="index">
            <!--上传弹框-->
          </el-tab-pane>
          <div class="content">
            <div class="search-bar">
              <template>
                <el-form :inline="true" :model="searchForm" class="demo-form-inline fl" size="mini">
                  <el-form-item>
                    <el-input v-model="searchForm.goodsTitle" placeholder="商品标题"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                  </el-form-item>
                </el-form>
              </template>
            </div>
            <div class="tabel-wrap">
              <template>
                <el-table :data="goodsList" >
                  <el-table-column property="id" label="ID" width="150"></el-table-column>
                  <el-table-column label="商品信息" width="280">
                    <template slot-scope="scope">
                      <img :src="scope.row.imgUrl" alt="" class="goods-list-img">
                      <span v-text="scope.row.goodsInfo"></span>
                    </template>
                  </el-table-column>
                  <el-table-column property="goodsType" label="商品类型"></el-table-column>
                  <el-table-column  label="选择">
                    <template slot-scope="scope">
                      <el-button type="text" size="mini" @click="deletePageModel(scope.row)">删除</el-button>  
                    </template>
                     <template slot-scope="scope">
                        <el-checkbox @change="handleCheckedChange($event, scope.row, activeName)" :checked="arrClassStatus[scope.row.id]"></el-checkbox>
                    </template> 
                  </el-table-column>
                </el-table>
              </template>        
            </div>    
          </div>
        </el-tabs>
        <div class="page-control">
          <el-pagination background  :page-size="10" :current-page.sync="pageOption.pageNum" @current-change="pageChange" layout="total, prev, pager, next" :total="totalSize">
          </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveGoods">确 定</el-button>
        </div>
      </el-dialog>
      
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import qs from 'qs'
const columns = [
  {
    title: '排序',
    width: 10,
    dataIndex: 'id',
  },
  {
    title: '商品标题',
    dataIndex: 'title',
    width: 30,
    imgUrl: 'imgUrl',
    hasUrl: true
  },
  {
    title: '商品类型',
    dataIndex: 'goodsType',
    width: 20
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    width: 10
  },
  {
    title: '操作',
    dataIndex: 'id',
    width: 20,
    action: true
  }
]
export default {
  name: 'delivery',
  components: {
    draggable
  },
  data () {
    return {
      columns: columns,
      themeId: null,
      tableData: [],
      goodsList: [],
      dialogTableVisible: false,
      dialogFormVisible: false,

      activeType: '课程',
      activeName: '课程',
      tabList: [{
        name: '课程'
      },{
        name: '专栏'
      }],
      classs: '课程',
      column: '专栏',
      searchForm:{
        goodsTitle: ''
      },
      pageOption: {
        pageNum: 1,
        pageSize: 10
      },
      currentPage: 1,
      multipleSelection:[],
      addArray:[],
      totalSize: 0,
      classIds: [],
      columnIds: [],
      arrClassStatus: [],
      arrColumnStatus: []
    }
  },

  created () {
    this.getList()
    this.themeId = this.$route.params.id
  },
  methods: {
    openDialogGoods () {
      this.getContentList(this.activeType)
      this.dialogTableVisible = true
    },
    // 获取商品数列表
    getList () {
      let themeId = this.$route.params.id
      this.$http.get('/goods/number/list', {params: {themeId}}).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
        }
      })
    },
    // 选中
    handleCheckedChange(event,row,activeName){
      if(activeName == "课程"){
        this.arrClassStatus[row.id] = event
      }
      if(activeName == "专栏"){
        this.arrColumnStatus[row.id] = event
      }
    },
    
    saveGoods () {
      for(let i = 0;i < this.arrClassStatus.length;i++){
        if(this.arrClassStatus[i] == true){
          this.classIds.push(i)
        }
      }
      for(let i = 0;i < this.arrColumnStatus.length;i++){
        if(this.arrColumnStatus[i] == true){
          this.columnIds.push(i)
        }
      }
      if (this.classIds.length > 0 || this.classIds.length > 0) {
        let params = {
          columnIds : this.columnIds.join(','),
          classIds : this.classIds.join(','),
          classs : this.classs,
          column : this.column,
        }
        this.$http.post('/associate/goods', qs.stringify(params)).then(res => {
          let data = res.data
          if (data.success) {
            this.dialogTableVisible = false
            this.$message.success('关联成功')
            this.getList()
          } else {
            this.dialogTableVisible = false
            let msg = data.desc || '关联失败'
            this.$message.error(msg)
          }
        })
      } else {
        console.log('error submit!!')
        return false
      }
    },
    // 切换tab
    handleClick(tab, event) {
      if(this.tabList[tab.index].name == this.activeName){
        return
      }
      this.activeName = this.tabList[tab.index].name
      this.getContentList(this.activeName)
    },
    // 获取全部内容列表
    getContentList (activeType) {
      let params = {
        goodsTitle: this.searchForm.goodsTitle,
        activeType: activeType,
        pageNum: 1,
        pageSize:10
      }
      this.$http.get('/associate/goods', {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.goodsList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
          this.pageOption.pageNum = 1
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 取消移除关系
    cancelRelation (row) {
      this.$confirm('确定移除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let loadPageId = row.id
        let themeId = this.themeId
        this.$http.get('/goods/number/remove', {
          params: {
            themeId,
            loadPageId
          }
        }).then(res => {
          let msg = res.data.success
          if (msg) {
            if (res.data.data) {
              this.$message.success('移除成功')
              this.getList()
            } else {
              let msg = res.data.desc || '移除失败'
              this.$message.error(msg)
            }
          } else {
            let msg = res.data.desc || '移除失败'
            this.$message.error(msg)
          }
        }, () => {
          this.$message.error('网络错误！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        })
      })
    },
    // 分页请求
    pageChange (currentPage) {
      this.currentPage = currentPage
      let params = {
        activeType: this.activeName,
        goodsTitle: this.searchForm.goodsTitle,
        pageNum: this.currentPage,
        pageSize:10
      }
      this.$http.get('/associate/goods', {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.goodsList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    onSearch () {
      let params = {
        activeType: this.activeName,
        goodsTitle: this.searchForm.goodsTitle,
        pageNum: this.pageOption.pageNum,
        pageSize:10
      }
      this.$http.get('/associate/goods', {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.goodsList = resp.data.content
          // 算出有多少条数据
          this.totalSize = resp.data.totalElements
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 拖拽
    datadragEnd (e) {
      let id = +this.tableData[e.newIndex].id
      let themeId = +this.themeId
      let start = +this.tableData[e.newIndex].sort
      let end = e.newIndex > e.oldIndex ? +(this.tableData[e.newIndex - 1].sort) : +(this.tableData[e.newIndex + 1].sort)
      this.$http.post('/goods/number/sort', {start, end, id, themeId}).then(res => {
        let resp = res.data
        if (resp.success) {
          this.$message.success('排序成功')
          this.getList()
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dlv-main{
  width: 100%;
  .title-wrap{
    width: 100%;
    height: 30px;
    border-bottom: 1px dotted #ccc;
    position: relative;
    .el-breadcrumb{
      position: absolute;
      left: 0;
      bottom: 10px;
      font-size: 16px;
    }
    .link-theme{
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
    }
    .connect-ad{
      cursor: pointer;
      color: #909399;
      font-weight: 400;
      &:hover{
        color:#333
      }
    }
  }
  .search-bar{
    margin-top: 20px
  }
  .page-control{
    float: right;
    margin-top: 20px;
    &:after{
      clear: both;
    }
  }
  .conbtent{
      padding: 30px 0
  }
  .el-dialog__body{
    overflow: hidden;
    .btn-wrap{
      float: right;
    }
  }
  .goods-list-img{
    height: 50px;
    width: 50px;
    display: inline-block;
    vertical-align: middle;
  }
}

</style>
