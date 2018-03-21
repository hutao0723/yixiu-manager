<template>
  <section class="dlv-main">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>皮肤市场</el-breadcrumb-item>
      </el-breadcrumb>
      <span class="link-theme">
        <i class="iconfont icon-guanlian"></i>
        <router-link to="editSkin">添加皮肤</router-link>
      </span>
    </div>
    <div class="conbtent">
      <div class="search-bar">
        <template>
          <el-form :inline="true" class="demo-form-inline" size="mini">
            <el-form-item label="皮肤名称">
              <el-input v-model="searchOption.skinName" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="tabel-content">
        <template>
          <el-row>
            <el-col :span="6" v-for="(item,index) in searchOption.skinList" :key="index" :offset="1">
              <el-card :body-style="{ padding: '0px' }">
                <img :src=item.pictureUrl class="image" @click.prevent="showLarge(item.pictureUrl)">
                <div class="skin-box">
                  <div>皮肤ID：{{item.id}}</div>
                  <div>创建时间：{{item.gmtCreate}}</div>
                  <div>更新时间：{{item.gmtModified}}</div>
                  <div>修订人：{{item.managerName}}</div>
                  <div class="skin-name">{{item.skinName}}</div>
                  <el-button type="text right" @click.prevent="deletePageModel(item)">删除</el-button>
                  <router-link :to="{path:'editSkin',query:{id:item.id}}">
                    <el-button type="text right ml20">编辑</el-button>
                  </router-link>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </template>
      </div>
      <div class="page-control">
        <el-pagination background :page-size="searchOption.pageSize" :current-page.sync="searchOption.pageNum"
                       @current-change="pageChange" layout="prev, pager, next"
                       :total="searchOption.totalSize"></el-pagination>
      </div>
      <el-dialog
        :visible.sync="picVisible"
        width="30%"
        top="5vh">
        <img :src=bigPictureUrl alt="" width="100%">
      </el-dialog>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'delivery',
    data() {
      return {
        searchOption: {
          pageNum: 1,
          pageSize: 3,
          skinName: '',
          totalSize: 0,
          skinList: [],
        },
        bigPictureUrl: '',
        picVisible: false
      }
    },
    created() {
      this.onloadList()
    },
    methods: {
      pageChange(pageNum) {
        this.searchOption.pageNum = pageNum;
        this.onloadList();
      },

      showLarge(item) {
        this.bigPictureUrl = item;
        this.picVisible = true;
      },

      // 列表获取
      onloadList() {
        let {skinName, pageNum, pageSize} = this.searchOption;
        let params = {skinName, pageNum, pageSize};
        this.load(params)
      },

      // 搜索
      onSearch() {
        let {skinName} = this.searchOption;
        let params = {skinName};
        this.load(params)
      },

      load(params){
        this.$http.get('/skin/list', {params}).then(res => {
          if (res.data.success) {
            this.searchOption.skinList = res.data.data.lists;
            this.searchOption.totalSize = res.data.data.totalSize
          } else {
            this.$message.error('获取数据失败')
          }
        }).catch(() => {
          this.$message.error('网络错误')
        })
      },
      
      // 删除皮肤
      deletePageModel(row) {
        let id = row.id
        this.$confirm('确认删除该皮肤？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('/skin/delete', {params: {id}}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.onloadList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
    }
  }
</script>

<style lang="less">
  .right {
    float: right;
  }

  .ml20 {
    margin-right: 20px;
  }

  .image {
    width: 100%;
    height: 20rem;
    display: block;
    cursor: pointer;
  }

  .el-card {
    margin-bottom: 2rem;
    /*cursor: pointer;*/
    .el-card__body {
      position: relative;
      margin-bottom: 2rem;
      user-select: none;

      .el-icon-circle-close-outline {
        position: absolute;
        right: 0px;
        font-size: 1.6rem;
        display: none;
      }
      &:hover {
        .el-icon-circle-close-outline {
          display: block;
        }
      }
    }
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
      .link-theme {
        display: inline-block;
        position: absolute;
        right: 0;
        bottom: 10px;
        font-size: 12px;
      }
    }
    .search-bar {
      margin-top: 20px
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
