const checkBrokerage = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入讲师抽成'))
  }
  setTimeout(() => {
    if (value > 100 || value < 0) {
      callback(new Error('请输入大于0.00小于100.00的数值'))
    } else {
      if(/^\d+(\.\d{1,2})?$/.test(value)){
        callback()
      }else{
        callback(new Error('请输入0.00-100.00的数值'))
      }
    }
  }, 500)
}
const knowlwdgerules = {
  nickName: [{
      required: true,
      message: '请输入讲师昵称',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 10,
      message: '长度在 1 到 10 个字符',
      trigger: 'blur'
    }
  ],
  rate: [{
    required: true,
    validator: checkBrokerage,
    trigger: 'blur'
  }],
  goodsGroupName: [{
    required: true,
    message: '请输入分组标题',
    trigger: 'blur'
    },
    {
      min: 1,
      max: 50,
      message: '长度在 1 到 50 个字符',
      trigger: 'blur'
    }
  ]
}
export default knowlwdgerules

