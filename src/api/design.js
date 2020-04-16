import request from '../utils/request'
//保存设计
export function DESIGN_SAVE(data) {
    return request({
        url: '/production/save',
        method: 'post',
        data
    })
}

//获取字体
export function GET_FONTFAMILY_BYNAME(data) {
    return request({
        url: '/resource/getfont?name=' + data,
        method: 'get',
    })
}