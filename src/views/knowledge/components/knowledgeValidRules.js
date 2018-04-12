
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

