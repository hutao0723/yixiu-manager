import axios from 'axios'
import getUrl from '../utils/get-url';
import qs from 'qs';
axios.defaults.withCredentials = true;

/**
 * get请求
 * @param {*} url 请求url'
 *
 * @param {*} params 请求参数
 */
export function get(url, params) {
    return axios.get(getUrl(url), { params }).then((response) => {
        return response.data;
    });
}

/**
 * post请求
 * @param {*} url 请求url
 * @param {*} params 请求参数
 */
export function post(url, params) {

    return axios.post(getUrl(url), qs.stringify(params,{ allowDots: true })).then((response) => {
        return response.data;
    });
}
