const minirules = {
  // typeManage类型管理的弹框
  parentName: [
    { required: true, message: '请输入一级类型', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入二级类型', trigger: 'blur' },
    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  // 内容编辑修改
  secondTypeName: [
    { required: true, message: '请选择二级类型', trigger: 'blur' }
  ],
  keyWord: [
    { required: true, message: '请输入描述词', trigger: 'blur' },
    { min: 1, max: 8, message: '长度在 1 到 8个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入描述内容', trigger: 'blur' },
    { min: 1, max: 75, message: '长度在 1 到 75 个字符', trigger: 'blur' }
  ],
  // 小程序内容选择类型
  firstTypeId: [
    { required: true, message: '请选择一级类型', trigger: 'blur' }
  ],
  typeId: [
    { required: true, message: '请选择二级类型', trigger: 'blur' },
  ],
  uploadUrl: [
    { required: true, message: '请选择文件'}
  ]
}
export default minirules
