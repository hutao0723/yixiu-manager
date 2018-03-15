<template>
  <section class="ofa-main-wrap">
    <div class="title-wrap">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/manager/officalAcount/graphType' }">图文类型</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="search-bar">
        <template>
        </template>
      </div>
      <div class="tabel-wrap">
        <el-form ref="graphForm" :model="graphForm" label-width="80px":rules="rules" >
            <el-form-item label="日期" prop="date">
                <el-date-picker type="date" placeholder="选择日期" v-model="graphForm.date" value-format="yyyy-MM-dd" style="width: 60%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="图文标题"  prop="title">
              <el-input v-model="graphForm.title" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item label="类型1" prop="typeOne">
              <el-row class="demo-autocomplete">
                <el-col>
                  <el-autocomplete style="width: 60%;" class="inline-input" v-model="graphForm.typeOne" :fetch-suggestions="querySearchOne"
                    placeholder="请输入内容" @select="handleSelect" ></el-autocomplete>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="类型2" prop="typeTwo">
              <el-row class="demo-autocomplete">
                <el-col>
                  <el-autocomplete style="width: 60%;" class="inline-input" v-model="graphForm.typeTwo" :fetch-suggestions="querySearchTwo" placeholder="请输入内容"
                    @select="handleSelect" ></el-autocomplete>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="类型3" prop="typeThree">
             <el-row class="demo-autocomplete">
                <el-col>
                  <el-autocomplete style="width: 60%;" class="inline-input" v-model="graphForm.typeThree" :fetch-suggestions="querySearchThree"  placeholder="请输入内容"
                    @select="handleSelect"  ></el-autocomplete>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <router-link :to="{ path: '/manager/officalAcount/graphType'}">
                  <el-button type="pain">取消</el-button>
              </router-link>
              <el-button type="primary" @click="editGraph">保存</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>     
  </section> 

</template>
<script>
  import ofarules from '../components/ofaCreateValidRules'
  import { formatDateNew } from '../../../utils/dateUtils'
  import qs from 'qs'
  export default {
    data () {
      return {
        rules: ofarules,
        graphTypeOneList: [],
        graphTypeTwoList: [],
        graphTypeThreeList: [],
        graphForm: {
          id: '',
          date: formatDateNew(new Date()),
          title: '',
          typeOne: '',
          typeTwo: '',
          typeThree: ''
        },
        associate: {
          typeOneArray: [],
          typeTwoArray: [],
          typeThreeArray: []
        }
      }
    },
    created () {
      this.getSingleGraph()
    },
    mounted () {
      // 存储保存信息时的数组 {typeOneArray:[],typeTwoArray:[],typeThreeArray:[]}
      let data = localStorage.getItem('data')
      if (data) {
        // 取本地存储数据中有值转换成目标联想数组[{},{},{}]，呈现联想效果
        this.graphTypeOneList = this.loadGraph(JSON.parse(data).typeOneArray)
        this.graphTypeTwoList = this.loadGraph(JSON.parse(data).typeTwoArray)
        this.graphTypeThreeList = this.loadGraph(JSON.parse(data).typeThreeArray)
        // 如果本地存储有值，取出值更新存值数组['1','2','3','4']，防止初始化时数组为空，再次添加之前的记录不存在
        this.associate.typeOneArray = JSON.parse(data).typeOneArray
        this.associate.typeTwoArray = JSON.parse(data).typeTwoArray
        this.associate.typeThreeArray = JSON.parse(data).typeThreeArray
      }
    },
    methods: {
      // 编辑保存图文
      editGraph () {
        this.$refs['graphForm'].validate((valid) => {
          if (valid) {
            this.graphForm.id = this.$route.params.id
            this.$http.post('/graphicType/update', qs.stringify(this.graphForm)).then(res => {
              let data = res.data
              if (data.success) {
                this.$message.success('保存成功')
                if (this.graphForm.typeOne) {
                  this.associate.typeOneArray.push(this.graphForm.typeOne)
                  this.associate.typeOneArray = this.setRemoveRepeat(this.associate.typeOneArray)
                  // 如果数组去重后长度还大于10则删除首个字
                  if (this.associate.typeOneArray.length > 10) {
                      this.associate.typeOneArray.shift()
                  }
                }
                if (this.graphForm.typeTwo) {
                  this.associate.typeTwoArray.push(this.graphForm.typeTwo)
                  this.associate.typeTwoArray = this.setRemoveRepeat(this.associate.typeTwoArray)
                  if (this.associate.typeTwoArray.length > 10) {
                      this.associate.typeTwoArray.shift()
                  }
                }
                if (this.graphForm.typeThree) {
                  this.associate.typeThreeArray.push(this.graphForm.typeThree)
                  this.associate.typeThreeArray = this.setRemoveRepeat(this.associate.typeThreeArray)
                  if (this.associate.typeThreeArray.length > 10) {
                      this.associate.typeThreeArray.shift()
                  }
                }
                localStorage.setItem('data', JSON.stringify(this.associate))
                this.$router.push('/manager/officalAcount/graphType')
              } else {
                let msg = data.desc || '保存失败'
                this.$message.error(msg)
                this.$router.push('/manager/officalAcount')
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 数组去重
      setRemoveRepeat (arr) {
        let resultarr = [...new Set(arr)]
        return resultarr
      },
      // 获得单个图文列表
      getSingleGraph () {
        let id = this.$route.params.id
        let params = {
          id: id
        }
        this.$http.get('/graphicType/detail', {params: params}).then(res => {
          let resp = res.data
          if (resp.success) {
            this.graphForm = resp.data
          } else {
            let msg = resp.desc || '请求失败'
            this.$message.error(msg)
          }
        })
      },
      // 联想查询类型1 graphTypeOneList类型1联想的列表[{},{},{}]
      querySearchOne(queryString, cb) {
        let graphTypeOneList = this.graphTypeOneList
        let results = queryString ? graphTypeOneList.filter(this.createFilter(queryString)) : graphTypeOneList
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 联想查询类型2 graphTypeTwoList类型2联想的列表[{},{},{}]
      querySearchTwo(queryString, cb) {
        let graphTypeTwoList = this.graphTypeTwoList
        let results = queryString ? graphTypeTwoList.filter(this.createFilter(queryString)) : graphTypeTwoList
        cb(results)
      },
      // 联想查询类型3 graphTypeThreeList类型3联想的列表[{},{},{}]
      querySearchThree(queryString, cb) {
        let graphTypeThreeList = this.graphTypeThreeList
        let results = queryString ? graphTypeThreeList.filter(this.createFilter(queryString)) : graphTypeThreeList
        cb(results)
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 本地存储数组['1','2','3']转换成目标联想数组查询类型[{value:'1'},{value:'2'},{value:'3'}]
      loadGraph (arrayType) {
        let arr = []
        for (let i = 0; i < arrayType.length; i++) {
          let obj = {}
          obj.value = arrayType[i]
          arr.push(obj)
        }
        // console.log(arr);
        return arr
      },
      handleSelect(item) {
        console.log(item)
      }
    }
  }
</script>
<style lang="less" scoped>
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
      a{
        text-decoration: none;
      }
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
  .page-control {
    float: right;
    margin-top: 20px;
    &:after {
      clear: both;
    }
  }
}
</style>
