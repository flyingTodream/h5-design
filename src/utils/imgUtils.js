export function createImg(srcImg, effectImg, width, height, callback) {

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height
    var img1 = new Image()
    //防止缓存
    img1.src = srcImg + '?v=' + getRanNum()
    var img2 = new Image()

    img2.src = effectImg + '?v=' + getRanNum()
    img1.setAttribute('crossOrigin', 'Anonymous')
    img2.setAttribute('crossOrigin', 'Anonymous')

    if (img2.complete) {
        context.drawImage(img2, 0, 0, width, height)
    } else {
        img2.onload = () => {
            context.drawImage(img2, 0, 0, width, height)
            context.globalCompositeOperation = 'source-in'
            if (img1.complete) {
                context.drawImage(img1, 0, 0, width, height)
                callback(canvas.toDataURL())
            } else {
                img1.onload = () => {
                    context.drawImage(img1, 0, 0, width, height)
                    callback(canvas.toDataURL('image/png'))
                }
            }

        }
    }

}
function getRanNum() {
    var result = [];
    for (var i = 0; i < 32; i++) {
        var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
        //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        result.push(String.fromCharCode(65 + ranNum));
    }
    return result.join('');
}

