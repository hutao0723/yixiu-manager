<template>
    <section class="dlv-main">
        <div class="title-wrap">
            <!--面包屑-->
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/manager' }">页面监控</el-breadcrumb-item>
            </el-breadcrumb>
            <span class="link-theme">
                <i class="iconfont icon-jia" style="vertical-align: middle;"></i>
                <span class="connect-ad" @click="addDialog()">页面监控</span>
            </span>
        </div>

        <div class="conbtent">
            <!--提示文字-->
            <div class="search-bar">
                说明：仅用于监控微信图文消息地址
            </div>
            <!--表格-->
            <div class="tabel-content">
                <template>
                    <el-table :data="tableData" style="width: 100%">

                        <el-table-column prop="monitorUrl" label="监控地址">

                        </el-table-column>

                        <el-table-column label="地址名称" prop="pageAlias" >
                           
                        </el-table-column>

                        <el-table-column prop="monitorStatus" label="监控状态">
                            <template slot-scope="scope">
                                {{scope.row.monitorStatus*1?"监控中":"待监控"}}
                            </template>      
                        </el-table-column>

                        <el-table-column label="操作" width="240">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="editDialog(scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="tableDel(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
        </div>

        <!--弹出框-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogAddVisible" width="1100px">
            <el-form ref="dialogForm" :model="dialogForm" :rules="rules" >

                <el-form-item label="监控地址" :label-width="formLabelWidth" prop='monitorUrl'>
                    <el-input v-model="dialogForm.monitorUrl" placeholder="微信图文地址"></el-input>
                </el-form-item>                    
                
                <el-form-item label="监控名称" :label-width="formLabelWidth" prop='pageAlias'>
                    <el-input v-model="dialogForm.pageAlias" placeholder="地址名称" ></el-input>
                </el-form-item>

                <el-form-item label="监控状态" :label-width="formLabelWidth" prop="monitorStatus">
                    <el-radio-group v-model="dialogForm.monitorStatus">
                        <el-radio label="待监控"></el-radio>
                        <el-radio label="监控中"></el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div class="btn-wrap">
                <el-button size="small" @click="dialogAddVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitDialog('dialogForm')">保存</el-button>
            </div>

        </el-dialog>
 
    </section>
</template>

<script>
  import qs from 'qs'

    export default {
        name: 'delivery',
        data() {
            let url = (rule, value, callback) => {
                var MobileRegex = /^https:\/\/mp.weixin.qq.com/;
                if (!MobileRegex.test(value)) {
                    callback(new Error('请输入正确微信图文地址'));
                }
                callback();
            };
            return {
                dialogTitle:'',
                dialogAddVisible: false,
                formLabelWidth: '120px',
                //弹出框验证规则
                rules: {
                    pageAlias: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { max: 20, message: '字符长度应小于20', trigger: 'blur' }
                    ],
                    monitorStatus: [
                        { required: true, message: '请选择监控状态', trigger: 'change' }
                    ],
                    monitorUrl:[
                        { required: true, message: '请输入微信图文地址', trigger: 'blur' },
                        { validator: url, trigger: 'blur' },
                        { max: 1000, message: '字符长度应小于1000', trigger: 'blur' }
                    ],
                },
                //弹出框表单
                dialogForm: {
                    pageAlias: null,
                    monitorUrl: null,
                    monitorStatus: null,
                },
                //表格数据
                tableData: [], 
            }
        },
        created() {
            this.getAllList()
        },
        methods: {
            // 数据请求
            getAllList() {
                this.$http.get('/pageMonitor/list').then(res => {
                    if (res.data.success) {
                        this.tableData = res.data.data
                    } else {
                        this.$message.error('获取数据失败')
                    }
                }, () => {
                    this.$message.error('网络错误')
                })
            },
            //新增
            addDialog(){
                const _this = this;
                _this.dialogTitle = '添加';
                _this.dialogForm = {
                     pageAlias:"",
                    monitorUrl: "",
                    monitorStatus: "待监控",
                };   
                _this.dialogAddVisible = true;
            },
            //编辑
            editDialog(row){
                const _this = this;
                _this.dialogTitle = '编辑';
                let state = row.monitorStatus*1?"监控中":"待监控";
                _this.dialogForm = {
                    id:row.id,
                    pageAlias: row.pageAlias,
                    monitorUrl: row.monitorUrl,
                    monitorStatus: state,
                };   
                _this.dialogAddVisible = true;
            },
            
            // 删除
            tableDel(row) {
                let id = row.id
                const _this = this;
                this.$confirm('确定删除本条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/pageMonitor/delete', qs.stringify({id})).then(res => {
                        let msg = res.data.success
                        if (msg) {
                            if (res.data.data) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                })

                                _this.getAllList()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '删除失败!'
                                })
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            // 提交弹出框表单
            submitDialog(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('验证能通过')                        
                        //验证成功提交给后台
                        let config = {};
                        config.pageAlias = _this.dialogForm.pageAlias;
                        config.monitorUrl = _this.dialogForm.monitorUrl;
                        if(_this.dialogForm.monitorStatus == '监控中'){
                            config.monitorStatus = 1;    
                        }else{
                            config.monitorStatus = 0;   
                        };
                        if(_this.dialogForm.id){
                            config.id = _this.dialogForm.id;
                        };
                        this.$http.get('/pageMonitor/save',{ params: config }).then(res => {
                            if (res.data.success) {
                                _this.dialogAddVisible = false;
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                })
                                _this.getAllList()
                            } else {
                                this.$message.error(res.data.desc)
                            }
                        }, () => {
                            this.$message.error('网络错误')
                        })

                    } else {
                        return false;
                    }
                });
            },

        }
    }
</script>

<style lang="less">
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
            .connect-ad {
                cursor: pointer;
                color: #909399;
                font-weight: 400;
                &:hover {
                    color: #333
                }
            }
        }
        .search-bar {
            margin-top: 20px;
            margin-bottom: 20px
        }
        .el-dialog__body {
            overflow: hidden;
            .btn-wrap {
                float: right;
            }
        }
        .table-headimg {
            height: 50px;
            width: 50px;
            display: inline-block;
            vertical-align: middle;
        }
    }
</style>