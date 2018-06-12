
const couponrules = {
  title: [
    { required: true, message: '请输入活动标题', trigger: 'blur'},
    { min: 1, max: 45, message: '长度在 1 到 45 个字符', trigger: 'blur'}
  ],
  coupon: [
    { required: true, message: '请选择奖励优惠券', trigger: 'blur'}
  ],
  itemSize: [
    { required: true, message: '请输入优惠券的张数', trigger: 'blur'},
    { min: 1, max: 99999999, message: '张数在 1 到 99999999之间 ', trigger: 'blur'}
  ],
  date: [
    { required: true, message: '请选择时间', trigger: 'blur' }
  ],
  keyWord: [
    { required: true, message: '请输入活动标题', trigger: 'blur'},
    { min: 1, max: 45, message: '长度在 1 到 45 个字符', trigger: 'blur'}
  ],
  price: [
    { required: true, message: '请输入面额', trigger: 'blur'},
    { min: 0.01, max: 999.99, message: '长度在 0.01 到 999.99 个字符', trigger: 'blur'}
  ],
  pageLocationId: [
    { required: true, message: '请选择跳转链接', trigger: 'blur' }
  ],
  day: [
    { required: true, message: '请输入有效期时长', trigger: 'blur'},
    { min: 1, max: 999, message: '张数在 1 到 999之间 ', trigger: 'blur'}
  ],
  limit: [
    { required: true},
  ],

}

export function formatToMs(date) {
  if (!date) return '';
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
export default couponrules

