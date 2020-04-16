import mock from './config';

// 遍历 `./data/` 目录下的json文件，生成mock配置
// json文件名为拦截的目标.do，json文件的内容作为返回的模拟数据
const reqPostJSON = (ctx) => {
    const keys = ctx.keys()
    const values = ctx.keys().map(ctx)
    return keys.map((val, ind) => {
        const action = val.replace('.json', '').replace('./', '')
        const item = {
            path: `${action}$`,
            method: 'post',
            handle() {
                return values[ind]
            }
        }
        return item
    })
}
const reqGetJSON = (ctx) => {
    const keys = ctx.keys()
    const values = ctx.keys().map(ctx)
    return keys.map((val, ind) => {
        const action = val.replace('.json', '').replace('./', '')
        const item = {
            path: `${action}$`,
            method: 'get',
            handle() {
                return values[ind]
            }
        }
        return item
    })
}
const postjsonfiles = reqPostJSON(require.context('./data/', true, /\.json$/))
const getjsonfiles = reqGetJSON(require.context('./data/', true, /\.json$/))
postjsonfiles.forEach(c => {
    mock.load([c])
});
getjsonfiles.forEach(c => {
    mock.load([c])
})

// options.forEach(option => {
//     mock.load(option)
// })