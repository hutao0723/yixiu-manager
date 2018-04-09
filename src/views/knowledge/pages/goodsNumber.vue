<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/knowledge/goodsGroup' }">商品组</el-breadcrumb-item>
        <el-breadcrumb-item>商品数</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-jia"></i>
        <span class="connect-ad" @click="openDialogSubscrition">商品</span>
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
    <!-- <div class="connect-loadPage-diolog">
      <el-dialog title="新增公众号" :visible.sync="dialogVisible" width="800px">
        <el-form  :inline="true" :model="adSubscriptionsForm" :rules="rules">
        <el-form-item label="待选公众号">
          <el-select  v-model="subscriptionId"  filterable remote reserve-keyword placeholder="待选公众号" :remote-method="remoteMethod" :loading="loading">
              <el-option v-for="item in subscriptionsList" :key="item.value" :label="item.label + item.value" :value="item.value">
              </el-option>
          </el-select>
          <el-button type="text"  size="mini" icon="el-icon-search" @click="getLoadPageBySubscription()">查询</el-button>
        </el-form-item> 
        <el-form-item label="待选落地页">
          <el-transfer  :titles="['待选落地页', '已选落地页']" v-model="adSubscriptionsForm.loadPageIds" :data="loadpagesList" width="300px"></el-transfer>
        </el-form-item> 
        <div class="btn-wrap">
          <el-button size="small" :disabled="!adSubscriptionsForm.loadPageIds.length" type="primary" @click="boundRelation">保存</el-button>
        </div>         
        </el-form>
      </el-dialog>
    </div> -->
  </section>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
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
      dialogVisible: false,
      adSubscriptionsForm: {
        // subscriptionId: null,
        loadPageIds: []
      },
      subscriptionId: null,
      loading: true,
      subscriptionsList: [

      ],
      loadpagesList: [
        {
          key: 1,
          label: '备选1'
        }
      ],
      tableData: []
    }
  },
  created () {
    this.getList()
    this.themeId = this.$route.params.id
  },
  computed: mapState({
    themeName: state => state.theme
  }),
  methods: {
    openDialogSubscrition () {
      this.dialogVisible = true
    },
    getList () {
      let themeId = this.$route.params.id
      this.$http.get('/goods/number/list', {params: {themeId}}).then(res => {
        if (res.data.success) {
          this.tableData = res.data.data
        }
      })
    },
    boundRelation () {
      if (this.adSubscriptionsForm.loadPageIds.length) {
        let _params = Object.assign({}, this.adSubscriptionsForm)
        _params.loadPageIds = _params.loadPageIds.toString()
        _params.themeId = this.themeId
        this.$http.get('/subscriptionTheme/boundRelation', {params: _params}).then(res => {
          if (res.data.success) {
            this.$message.success('保存成功')
            this.dialogVisible = false
            window.location.reload()
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
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
