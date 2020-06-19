import request from '../utils/request'

// 生成登录二维码 get
// /wx/auth/getQrCode 
export function getQrCode() {
    return request({
        url: '/auth/getQrCode',
        method: 'get',
    })
}

// 轮询登录状态 get
///wx/auth/checkLogin?
export function checkLogin(param) {
    return request({
        url: '/auth/checkLogin',
        method: 'get',
        params: param
    })
}