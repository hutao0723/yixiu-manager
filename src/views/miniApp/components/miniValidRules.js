const minirules = {
// typeManage类型管理的弹框
  aType: [
    { required: true, message: '请输入一级类型', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  bType: [
    { required: true, message: '请输入二级类型', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  // 小程序内容选择类型
  aClassType: [
    { required: true, message: '请选择一级类型', trigger: 'blur' }
  ],
  bClassType: [
    { required: true, message: '请选择二级类型', trigger: 'blur' },
  ]
}
export default minirules
