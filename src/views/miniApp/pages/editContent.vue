<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp/contentManage' }">内容管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑内容</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <!-- :rules="rules" -->
        <el-form ref="graphForm" :model="typeForm" label-width="80px" >
            <el-form-item label="二级类型" prop="aClassType">
              <el-select v-model="typeForm.bClassType" placeholder="二级类型" style="width: 60%;">
                <el-option v-for="item in bTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述词"  prop="descriptions">
              <el-input v-model="typeForm.descriptions" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item label="描述内容"  prop="descontent">
              <el-input v-model="typeForm.descontent" style="width: 60%;" type="textarea" :rows="8"></el-input>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/miniApp/contentManage'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" @click="">保存</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div> 
  </section> 

</template>
<script>
  import { formatDateNew } from '../../../utils/dateUtils'
  import qs from 'qs'
  export default {
    data () {
      return {
        typeForm: {
          bClassType: '',
          descriptions: '',
          descontent: ''
        },
        bTypeList: []
      }
    }
  }
</script>
<style lang="less" scoped>
  .search-bar {
    margin-top: 20px;
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
      a{
        text-decoration: none;
        color: #909399;
        margin-right:20px;
      }
      .connect-ad {
        cursor: pointer;
        color: #909399;
        font-weight: 400;
        &:hover {
          color: #333
        }
      }
    }
  }
</style>
