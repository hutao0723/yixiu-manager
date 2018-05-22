
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
export function formatDateNew(date) {
  if (!date) return '';
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  month = ('0' + month).slice(-2);
  day = ('0' + day).slice(-2);
  return year + '-' + month + '-' + day;
}
export function formatToMs(date) {
  if (!date) return '-';
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '00' : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  month = ('0' + month).slice(-2);
  day = ('0' + day).slice(-2);
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
export default knowlwdgerules

