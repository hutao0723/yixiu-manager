const checkWechatID = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('微信号不能为空'))
  }
  setTimeout(() => {
    console.log(value)
    var reg = /^\w+|_$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的字符'))
    } else {
      if (value.length > 20) {
        callback(new Error('确保长度小于20'))
      } else {
        callback()
      }
    }
  }, 1000)
}

const ofarules = {
  name: [
    { required: true, message: '请输入公众号', trigger: 'blur' },
    { min: 1, max: 5, message: '长度在 1 到 20 个字符', trigger: 'blur' }

  ],
  wechatId: [
    {
      validator: checkWechatID,
      trigger: 'blur'
    }
  ],
  originId: [
    { required: true, message: '请输入原始ID', trigger: 'blur' }

  ],
  avatar: [{}],
  qrcode: [{}],
  type: [
    { required: true, message: '请选择公众号类型', trigger: 'change' }

  ],
  appId: [
    { required: true, message: '请输入appId', trigger: 'blur' },
    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
  ],
  appSecrect: [
    { required: true, message: '请输入appSecrect', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  serverUrl: [
    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }

  ],
  serverToken: [
    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
  ],
  serverEaeskey: [
    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入图文标题', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请选择时间', trigger: 'blur' }
  ],
  typeOne: [
    { min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur' }
  ],
  typeTwo: [
    { min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur' }
  ],
  typeThree: [
    { min: 0, max: 10, message: '长度在 0 到 10 个字符', trigger: 'blur' }
  ],
  uploadUrl: [
    { required: true, message: '请选择文件'}
  ]
}
export default ofarules
