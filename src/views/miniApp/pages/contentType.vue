<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/miniApp' }">小程序</el-breadcrumb-item>
        <el-breadcrumb-item>内容</el-breadcrumb-item>
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
            <el-form-item label="一级类型" prop="aClassType">
              <el-select v-model="typeForm.aClassType" placeholder="一级类型">
                <el-option v-for="item in aTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级类型" prop="bClassType">
              <el-select v-model="typeForm.bClassType" placeholder="二级类型">
                <el-option v-for="item in bTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
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
          aClassType: '',
          bClassType: ''
        },
        aTypeList: [],
        bTypeList: []
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
