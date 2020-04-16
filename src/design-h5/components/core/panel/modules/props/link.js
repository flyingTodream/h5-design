const Link = {
    DefaultStyle: {
        top: 100,
        left: 10,
        width: 80,
        height: 30,
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: 400,
        backgroundColor: 'rgb(34, 84, 244)',
        fontSize: 14,
        borderColor: 'rgb(217, 64, 12)',
        position: 'absolute',
        borderWidth: 0,
        borderRadius: 0
    },
    DefaultPluginProps: {
        uuid: new Date().getTime(),
        zoom: 12,
        text: '跳转链接',
        url: 'https://www.baidu.com'
    }
}
export default Link