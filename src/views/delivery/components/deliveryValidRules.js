const checkthresholdNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('阈值不能为空'))
  }
  setTimeout(() => {
    console.log(value)
    if (!Number.isInteger(value)) {
      callback(new Error('请输入数字值'))
    } else {
      if (value > 1000000) {
        callback(new Error('阈值必须小于1000000'))
      } else {
        callback()
      }
    }
  }, 1000)
}
const checkloadPageUrl = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('地址不能为空'))
  }
  setTimeout(() => {
    if (value > 1000) {
      callback(new Error('阈值必须小于1000000'))
    } else {
      callback()
    }
  }, 500)
}
export const rules = {
  adPlat: [
      { required: true, message: '请输入活动名称', trigger: 'blur' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  adPlan: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  adress: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  subject: [
      { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
  ]
}


export const loadPagerules = {
  subscriptionId: [
    { required: true, message: '请选择公众号名称', trigger: 'change' }

  ],
  loadPageUrl: [
    { validator: checkloadPageUrl, trigger: 'blur' }
  ],
  thresholdNum: [
    {validator: checkthresholdNum, trigger: 'blur'}
  ]
}
