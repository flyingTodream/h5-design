<template>
  <div class="vx-notsupport">
    <h3>爱友圈</h3>
    <h4>10W+原创的免费设计模板/云端在线编辑/拖拽1分钟出图</h4>
    <div class="vx-body-card">
      <div class="body-card-left">
        <p>您当前的浏览器兼容性较差</p>
        <div class="left-tips">为保证更好的使用体验：</div>
        <ul>
          <li>
            若当前为QQ/360/搜狗/遨游浏览器，
            请切换为“极速模式”
          </li>
          <li>或者直接升级为最新版的谷歌浏览器</li>
          <a target="_blank" href="https://www.google.cn/chrome/">下载谷歌浏览器</a>
          <li>
            您还可以使用我们的手机端，
            享受更流畅的操作体验
          </li>
          <div class="btn">
            <div class="qr">
              <img src="../assets/image/miniqr.png" />
              <div class="weixin">微信扫码</div>
            </div>

            <img class="phone" src="../assets/image/iconiphone@2x.png" />手机端
            <div class="xing"></div>
          </div>
        </ul>
      </div>
      <div class="body-card-right">
        <img src="../assets/image/编组@2x.png" />
      </div>
    </div>
  </div>
</template>
<script>
var browser = {
  versions: (function () {
    var u = navigator.userAgent
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == ' qq', //是否QQ
    }
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
}
export default {
  mounted() {
    if (!browser.versions.trident) {
      // this.$router.push('/')
      return
    }
  },
}
</script>
<style lang="scss" scoped>
.vx-notsupport {
  width: 100%;
  height: 100%;
  min-width: 75rem;
  background: #f8fafc;
  h3 {
    width: 100%;
    text-align: center;
    font-size: 2rem;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 2.63rem;
    letter-spacing: 6px;
    font-weight: 600;
    padding: 4rem 0 1rem 0;
  }
  h4 {
    width: 100%;
    text-align: center;
    font-size: 1.13rem;
    font-family: MicrosoftYaHei;
    color: #666666;
    line-height: 1.63rem;
    padding-bottom: 2.5rem;
  }
  .vx-body-card {
    margin: 0 auto;
    width: 70rem;
    height: 41.25rem;
    padding: 5rem;
    background: #ffffff;
    box-shadow: 0rem 0.25rem 1rem 0rem rgba(0, 0, 0, 0.1);
    border-radius: 0.25rem;
    .body-card-right {
      float: right;
      img {
        width: 28.4rem;
        height: 33rem;
      }
    }
    .body-card-left {
      width: 50%;
      float: left;
      p {
        width: 80%;
        margin: 0 auto;
        padding: 0 0 3.5rem 0;
        font-size: 2rem;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 3rem;
        text-align: left;
      }
      .left-tips {
        width: 80%;
        margin: 0 auto;
        font-size: 1.13rem;
        font-family: MicrosoftYaHei;
        color: #666666;
        line-height: 1.63rem;
      }
      ul {
        width: 80%;
        margin: 0 auto;
        li {
          width: 100%;
          text-align: left;
          padding: 1.88rem 0;
          font-size: 1rem;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 1.5rem;
          list-style: disc;
          list-style-position: inside;
        }
        a {
          font-size: 0.88rem;
          font-family: MicrosoftYaHei;
          color: #409eff;
          line-height: 1.38rem;
          text-decoration: none;
        }
        .btn:hover {
          .qr {
            display: block;
          }
          .xing {
            display: block;
          }
        }
        .btn {
          width: 6.75rem;
          height: 2.5rem;
          background: #409eff;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          .phone {
            width: 0.8rem;
            height: 1.25rem;
            margin-right: 0.5rem;
          }

          .qr {
            display: none;
            transition: all 0.5s;
            padding: 2rem 3rem;
            position: absolute;
            bottom: 2.2rem;
            background: #fff;
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
            left: -3rem;
            img {
              width: 7rem;
              height: 7rem;
            }
            .weixin {
              margin-top: 1rem;
              font-size: 0.8rem;
              width: 100%;
              text-align: center;
              color: #444;
            }
          }
          .xing {
            display: none;
            content: '';
            position: absolute;
            transition: all 0.5s;
            width: 0;
            bottom: 1.5rem;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 10px solid #fff;
          }
        }
      }
    }
  }
}
</style>