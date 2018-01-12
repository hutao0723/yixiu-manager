const ofarules = {
  name: [
    { required: true, message: '请输入公众号', trigger: 'blur' },
    { min: 1, max: 5, message: '长度在 1 到 20 个字符', trigger: 'blur' }

  ],
  backupName: [
    { required: true, message: '请输入公众号名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }

  ],
  wechatId: [
    { required: true, message: '请输入微信号', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
  ]
}
export default ofarules
