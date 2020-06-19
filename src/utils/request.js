import MyStorage from "src/utils/cache"
import axios from 'axios';
import {
  Message
} from 'element-ui';
import util from 'src/design/utils';
import store from 'src/store'
// 创建一个错误
function errorCreate(msg) {
  // 
  const err = new Error(msg)
  errorLog(err)
  throw err

}

function errorLog(err) {
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>');
  }
  // 显示提示
  Message({
    message: err.message,
    type: 'error',
    duration: 5 * 1000 // 显示时长(ms)
  });
}

// 'http://111.67.205.205:18080/wx'VUE_APP_BASE_API
// 创建一个 axios 实例
const Axios = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // 请求超时时间
});

const Upload = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000,
})
/**
 * 请求拦截器配置方法
 * @param {*} config 
 */
const requestFn = config => {
  // 在请求发送之前做一些处理
  // config.data = {...commonData, ...config.data }; // 合并公共数据
  if (!config.headers['X-Litemall-Token']) {
    config.headers['X-Litemall-Token'] = `${MyStorage.getItem('Token') || ''}`;
  }
  config.headers['Cache-control'] = 'max-age=20,immutable'
  return config
}
/**
 * 请求拦截器配置错误处理方法
 * @param {*} config 
 */
const requestErrFn = error => {
  errorLog(error);
  Promise.reject(error);
}
/**
 * 响应拦截器配置方法
 * @param {*} response 
 */
const responseFn = response => {

  // dataAxios 是 axios 返回数据中的 data
  const dataAxios = response.data
  // 这个状态码是和后端约定的
  const {
    errno
  } = dataAxios
  // 根据 code 进行判断
  if (errno === undefined) {
    return dataAxios;
  } else {
    switch (errno) {
      case 400:
        errorCreate(`${dataAxios.errmsg}`);
        break;
      case 403:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 404:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 408:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 500:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 501:
        MyStorage.clear()
        store.commit('updateLoginState', false)
        store.commit('updateShowLogin', true)

        // errorCreate(`${dataAxios.errmsg}`);
        break
      case 502:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 503:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 504:
        errorCreate(`${dataAxios.errmsg}`);
        break
      case 505:
        errorCreate(`${dataAxios.errmsg}`);
        break
      default:
        return dataAxios;
    }
  }
}
/**
 * 响应拦截器错误处理方法
 * @param {*} error 
 */
const responseErrFn = error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '请求错误';
        break
      case 401:
        error.message = '未授权，请登录';
        break
      case 403:
        error.message = '拒绝访问';
        break
      case 404:
        error.message = `请求地址出错`;
        break
      case 408:
        error.message = '请求超时';
        break
      case 500:
        error.message = '服务器内部错误';
        break
      case 501:
        error.message = '服务未实现';
        break
      case 502:
        error.message = '网关错误';
        break
      case 503:
        error.message = '服务不可用';
        break
      case 504:
        error.message = '网关超时';
        break
      case 505:
        error.message = 'HTTP版本不受支持';
        break
      default:
        break
    }
  }
  errorLog(error);
  return Promise.reject(error);
}
// 请求拦截器
Axios.interceptors.request.use(
  requestFn,
  requestErrFn
);
// 响应拦截器
Axios.interceptors.response.use(
  responseFn,
  responseErrFn
);
Upload.interceptors.response.use(
  responseFn,
  responseErrFn
)
export {
  Axios,
  Upload
};
export default Axios
