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
  planPlatform: [
    {
      required: true,
      message: '请输入活动名称',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 5,
      message: '长度在 3 到 5 个字符',
      trigger: 'blur'
    }
  ],
  planName: [
    {
      required: true,
      message: '请广告计划名称',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 30,
      message: '最多30个字符',
      trigger: 'blur'
    }

  ],
  planId: [{
    required: true,
    message: '请输入广告计划ID',
    trigger: 'blur'
  }, {
    min: 1,
    max: 30,
    message: '最多30个字符',
    trigger: 'blur'
  }],
  pushUrl: [
    {
      required: true,
      message: '请输入广告计划的投放链接',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 1000,
      message: '长度在 1 到 1000 个字符',
      trigger: 'blur'
    }
  ],
  themeId: [
    {
      required: true,
      message: '请选择公众号',
      trigger: 'change'
    }
  ]
}

export const loadPagerules = {
  subscriptionId: [
    {
      required: true,
      message: '请选择公众号名称',
      trigger: 'change'
    }

  ],
  loadPageUrl: [{
    validator: checkloadPageUrl,
    trigger: 'blur'
  }],
  thresholdNum: [{
    validator: checkthresholdNum,
    trigger: 'blur'
  }]
}
export const themeRules = {
  newTheme: [{
    required: true,
    message: '请输入主题名称',
    trigger: 'blur'
  }, {
    min: 1,
    max: 20,
    message: '长度在 1 到 20 个字符',
    trigger: 'blur'
  }],
  theme: [
    {
      required: true,
      message: '请输入主题名称',
      trigger: 'blur'
    }, {
      min: 1,
      max: 20,
      message: '长度在 1 到 20 个字符',
      trigger: 'blur'
    }

  ],
  copyTheme: [{
    required: true,
    message: '请输入主题名称',
    trigger: 'blur'
  }, {
    min: 1,
    max: 20,
    message: '长度在 1 到 20 个字符',
    trigger: 'blur'
  }]

}

