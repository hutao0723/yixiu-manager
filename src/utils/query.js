/**
 * 获取当前url上所有参数
 * @return {Object}
 */

export function getParams() {
    const arr = window.location.href.includes('?') && window.location.href.split('?')[1].split('&');
    const params = {};
    for (let i = 0; i < arr.length; i++) {
      const strs = arr[i].split('=');
      params[strs[0]] = decodeURIComponent(strs[1]);
    }
    return params;
}


