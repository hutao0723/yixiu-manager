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
                    <th v-bind:class="column.className" v-bind:style="{width: column.width + '%'}" >
                      {{column.title}}
                      <!-- <i class="el-tooltip el-icon-question cp item" aria-describedby="el-tooltip-2351" tabindex="0"  @mouseover="overShow" @mouseout="outHide"></i>  -->
                    </th>
                  </template>
                </tr>
              </thead>
              <draggable v-model="tableData" :element="'tbody'" @update="datadragEnd">
                <tr class="tr-items" v-for="(item, index) in tableData" :key="item.relationSort">
                  <template v-for="column in columns">
                    <template v-if="column.action">
                      <td>
                         <el-button type="text" size="small" @click="cancelRelation(item)">移除</el-button> 
                      </td>
                    </template>
                    <template v-else-if="column.hasUrl">
                      <td> 
                          <div v-if="item[column.lateralCover]" class="img-box" v-bind:style="{backgroundImage:'url('+item[column.lateralCover]+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                          <div v-else-if="item[column.verticalCover]" class="img-box" v-bind:style="{backgroundImage:'url('+item[column.verticalCover]+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                          <div  v-else class="img-box" v-bind:style="{backgroundImage:'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                           <span v-if="item[column.dataIndex].length > 30" v-text="item[column.dataIndex]" v-bind:style="{'-webkit-box-orient': 'vertical'}" class="two-ellipsis-list twoLines ln37 w330"></span>
                           <span v-else v-text="item[column.dataIndex]" class="ml10 ln75"></span>
                      </td>
                    </template>
                    <template v-else-if="column.type">
                      <td v-if="item[column.dataIndex] == '1'"> 
                        <span>课程—音频</span>
                      </td>
                      <td v-else> 
                        <span>专栏</span>
                      </td>
                    </template>
                    <template v-else-if="column.price">
                      <td> 
                        {{item[column.dataIndex] ? (item[column.dataIndex] / 100).toFixed(2) : ''}}
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
          <table  v-else>
            <tr class="tr-header">
              <template v-for="column in columns">
                <th v-bind:class="column.className" v-bind:style="{width: column.width + '%'}">
                  {{column.title}}
                </th>
              </template>
            </tr>
            <tr class="tr-header"><td colspan="5" style="text-align:center">暂无数据</td></tr>
          </table>
        </template>
      </div>
    </div>

    <div class="connect-loadPage-diolog">
      <el-dialog title="关联商品" :visible.sync="dialogTableVisible">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="pad-length">
          <el-tab-pane :label="course" name="课程">
            <div class="content">
              <div class="search-bar">
                <template>
                  <el-form :inline="true" :model="searchForm" class="demo-form-inline fl" size="mini">
                    <el-form-item>
                      <el-input v-model="searchForm.title" placeholder="商品标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSearch(activeName)">查询</el-button>
                    </el-form-item>
                  </el-form>
                </template>
              </div>
              <div class="tabel-wrap">
                <template>
                  <el-table :data="goodsList" >
                    <el-table-column property="id" label="ID" width="100"></el-table-column>
                    <el-table-column label="商品信息" width="260">
                      <template slot-scope="scope">
                        <div v-if="scope.row.lateralCover" class="img-box" v-bind:style="{backgroundImage:'url('+scope.row.lateralCover+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                        <div v-else-if="scope.row.verticalCover" class="img-box" v-bind:style="{backgroundImage:'url('+scope.row.verticalCover+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                        <div  v-else class="img-box" v-bind:style="{backgroundImage:'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                         <span v-if="scope.row.title.length > 10" v-text="scope.row.title" v-bind:style="{'-webkit-box-orient': 'vertical'}" class="two-ellipsis-list twoLines ln37 w150"></span>
                         <span v-else v-text="scope.row.title" class="ml10 ln75"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品类型" width="200">
                      <template slot-scope="scope">
                        <div> 
                          课程—音频
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column  label="选择">
                      <template slot-scope="scope">
                          <el-checkbox @change="handleCheckedChange($event, scope.row, activeName)"  :checked="arrColumnStatus[scope.row.id]" v-model="scope.row.checked"></el-checkbox>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>        
              </div>    
            </div>
            <div class="page-control">
              <el-pagination background  :page-size="10" :current-page.sync="pageOption.pageNum" @current-change="pageChange($event,activeName)" layout="total, prev, pager, next" :total="totalSize">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="column" name="专栏">
            <div class="content">
              <div class="search-bar">
                <template>
                  <el-form :inline="true" :model="searchForm" class="demo-form-inline fl" size="mini">
                    <el-form-item>
                      <el-input v-model="searchForm.title" placeholder="商品标题"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onSearch(activeName)">查询</el-button>
                    </el-form-item>
                  </el-form>
                </template>
              </div>
              <div class="tabel-wrap">
                <template>
                  <el-table :data="goodsList" >
                    <el-table-column property="id" label="ID" width="100"></el-table-column>
                    <el-table-column label="商品信息" width="260">
                      <template slot-scope="scope" >
                        <div v-if="scope.row.lateralCover" class="img-box" v-bind:style="{backgroundImage:'url('+scope.row.lateralCover+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                        <div v-else-if="scope.row.verticalCover" class="img-box" v-bind:style="{backgroundImage:'url('+scope.row.verticalCover+')',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                        <div  v-else class="img-box" v-bind:style="{backgroundImage:'url(//yun.dui88.com/yoofans/images/201804/noClassImg.png)',backgroundSize: 'contain',backgroundPosition: 'center'}"></div>
                        <span v-if="scope.row.title.length > 10" v-text="scope.row.title" v-bind:style="{'-webkit-box-orient': 'vertical'}" class="two-ellipsis-list twoLines ln37 w150"></span>
                        <span v-else v-text="scope.row.title" class="ml10 ln75"></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品类型" width="200">
                      <template slot-scope="scope">
                        <div> 
                          专栏
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column  label="选择">
                      <template slot-scope="scope">
                          <el-checkbox @change="handleCheckedChange($event, scope.row, activeName)"  v-model="scope.row.checked"></el-checkbox>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>        
              </div>    
            </div>
            <div class="page-control">
              <el-pagination background  :page-size="10" :current-page.sync="pageOption.pageNum" @current-change="pageChange($event,activeName)" layout="total, prev, pager, next" :total="totalSize">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
        
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
    width: 8,
    render: (text, record, index) => {
      return index + 1
    }
  },
  {
    title: '商品标题',
    dataIndex: 'title',
    width: 45,
    itemPicture: 'itemPicture',
    lateralCover: 'lateralCover',
    verticalCover: 'verticalCover',
    hasUrl: true
  },
  {
    title: '商品类型',
    dataIndex: 'itemType',
    width: 8,
    type: true
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    width: 8,
    price: true
  },
  // {
  //   title: '分销/抽成',
  //   dataIndex: 'price',
  //   width: 8,
  //   distribute: true
  // },
  // {
  //   title: '讲师/抽成',
  //   dataIndex: 'price',
  //   width: 8,
  //   lecturer: true
  // },
  {
    title: '操作',
    dataIndex: 'id',
    width: 10,
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
      goodsGroupId: null,
      tableData: [],
      goodsList: [],
      dialogTableVisible: false,
      dialogFormVisible: false,

      course: '课程',
      column: '专栏',
      activeName: '课程',
      checkedTab: '课程',
      searchForm:{
        title: ''
      },
      pageOption: {
        pageNum: 1,
        pageSize: 10
      },
      currentPage: 1,
      multipleSelection:[],
      addArray:[],
      totalSize: 0,
      courseIds: [],
      columnIds: [],
      arrClassStatus: [],
      arrColumnStatus: [],

      showText: false,
      hideText: true
    }
  },
  created () {
    this.getList()
    this.goodsGroupId = this.$route.params.id
  },
  methods: {
    // overShow () {
    //   this.showText = !this.showText
    //   this.hideText = !this.hideText
    // },
    // outHide () {
    //   this.showText = !this.showText
    //   this.hideText = !this.hideText
    // },
    openDialogGoods () {
      this.arrClassStatus = []
      this.arrColumnStatus = []
      this.searchForm.title = ''
      this.getContentList(this.activeName)
      this.dialogTableVisible = true
    },
    // 获取商品数列表
    getList () {
      let id = this.$route.params.id
      this.$http.get('/goodsGroup/goods/list', {params: {id}}).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
        }
      })
    }, 
    // 切换tab
    handleClick(tab, event) {
      if(this.activeName == this.checkedTab){
        return
      }
      this.searchForm.title = ''
      this.checkedTab = this.activeName
      this.getContentList(this.activeName)
    },
    // 获取全部内容列表
    getContentList (activeName) {
      let url
      if(activeName == "课程"){
        url = '/goodsGroup/course/list'
      }
      if(activeName == "专栏"){
        url = '/goodsGroup/column/list'
      }
      let params = {
        goodsGroupId: this.goodsGroupId,
        title: this.searchForm.title,
        pageNum: 1,
        pageSize:10
      }
      this.$http.get(url, {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          let arr = resp.data.lists
          if(arr != undefined){
            if(activeName == "课程"){
              arr.forEach(item=>{
                if(this.arrClassStatus[item.id]){
                  item['checked'] = true;
                }else{
                  item['checked'] = false;
                }
              })
            }
            if(activeName == "专栏"){
              arr.forEach(item=>{
                if(this.arrColumnStatus[item.id]){
                  item['checked'] = true;
                }else{
                  item['checked'] = false;
                }
              })
            }
          }
          this.goodsList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
          this.pageOption.pageNum = 1
          this.currentPage = 1
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 分页请求
    pageChange (currentPage,activeName) {
      let url
      if(activeName == "课程"){
        url = '/goodsGroup/course/list'
      }
      if(activeName == "专栏"){
        url = '/goodsGroup/column/list'
      }
      this.currentPage = currentPage
      let params = {
        goodsGroupId: this.goodsGroupId,
        title: this.searchForm.title,
        pageNum: this.currentPage,
        pageSize:10
      }
      this.$http.get(url, {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          let arr = resp.data.lists
          if(arr != undefined){
            if(activeName == "课程"){
              arr.forEach(item=>{
                if(this.arrClassStatus[item.id]){
                  item['checked'] = true;
                }else{
                  item['checked'] = false;
                }
              })
            }
            if(activeName == "专栏"){
              arr.forEach(item=>{
                if(this.arrColumnStatus[item.id]){
                  item['checked'] = true;
                }else{
                  item['checked'] = false;
                }
              })
            }
          }
          this.goodsList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    onSearch (activeName) {
      let url
      if(activeName == "课程"){
        url = '/goodsGroup/course/list'
      }
      if(activeName == "专栏"){
        url = '/goodsGroup/column/list'
      }
      let params = {
        goodsGroupId: this.goodsGroupId,
        title: this.searchForm.title,
        pageNum: 1,
        pageSize:10
      }
      this.$http.get(url, {params:params}).then(res => {
        let resp = res.data
        if (resp.success) {
          let arr = resp.data.lists
          if(arr != undefined){
            if(activeName == "课程"){
              arr.forEach(item=>{
                if(this.arrClassStatus[item.id]){
                  item['checked'] = true;
                }else{
                  item['checked'] = false;
                }
              })
            }
            if(activeName == "专栏"){
              arr.forEach(item=>{
                if(this.arrColumnStatus[item.id]){
                  item['checked'] = true;
                }else{
                  item['checked'] = false;
                }
              })
            }
          }
          this.goodsList = resp.data.lists
          // 算出有多少条数据
          this.totalSize = resp.data.totalSize
          this.pageOption.pageNum = 1
          this.currentPage = 1
        } else {
          let msg = resp.desc || '请求失败'
          this.$message.error(msg)
        }
      })
    },
    // 选中
    handleCheckedChange(event,row,activeName){
      if(activeName == "课程"){
        this.arrClassStatus[row.id] = event
        // console.log(this.arrClassStatus)
      }
      if(activeName == "专栏"){
        this.arrColumnStatus[row.id] = event
        // console.log(this.arrColumnStatus)
      }
    },
    saveGoods () {
      for(let i = 0;i < this.arrClassStatus.length;i++){
        if(this.arrClassStatus[i] == true){
          this.courseIds.push(i)
        }
      }
      for(let i = 0;i < this.arrColumnStatus.length;i++){
        if(this.arrColumnStatus[i] == true){
          this.columnIds.push(i)
        }
      }
      if (this.courseIds.length > 0 || this.columnIds.length > 0) {
        let params = {
          columnIds : this.columnIds.join(','),
          courseIds : this.courseIds.join(','),
          id : this.$route.params.id
        }
        this.$http.post('/goodsGroup/goods/add', qs.stringify(params)).then(res => {
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
          this.courseIds = []
          this.columnIds = []
          this.arrClassStatus = []
          this.arrColumnStatus = []
        })
      } else {
        this.$message.error("请选择关联商品")
        return false
      }
    },

    // 取消移除关系
    cancelRelation (row) {
      this.$confirm('确定移除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = row.id
        let goodsGroupId = this.goodsGroupId
        let params = {goodsGroupId,id}
        this.$http.post('/goodsGroup/goods/delete', qs.stringify(params)).then(res => {
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
    // 拖拽
    datadragEnd (e) {
      let id = +this.tableData[e.newIndex].id
      let start = +this.tableData[e.newIndex].relationSort
      let end = e.newIndex > e.oldIndex ? +(this.tableData[e.newIndex - 1].relationSort) : +(this.tableData[e.newIndex + 1].relationSort)
      let params = {start, end, id}
      this.$http.post('/goodsGroup/goods/sort', qs.stringify(params)).then(res => {
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
  /*不同规格的图片显示*/
  .long-img{
    height: 54.5px;
    width: 75px;
  }
  .width-img{
    height: 48.4px;
    width: 36px;
  }
  .imgBox{
    display: inline-block;
    vertical-align: middle;
    float: left;
  }
  .twoLines{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on*/
    float: left;
    margin-left: 10px;
  }
  .ln75{
    line-height:75px;
  }
  .ln37{
    line-height:37px;
  }
  .w330{
    width:330px;
  }
  .w150{
    width:150px;
  }
  .tr-header th{
    font-weight: bold;
  }
  .ml10{
    margin-left:10px;
  }
  .img-box{
    overflow: hidden;
    width: 75px;
    height: 75px;
    display: inline-block;
    float: left;
    background-repeat: no-repeat;
  }
  .show{
    display: block;
  }
  .hide{
      display: none;
  }
}

</style>
