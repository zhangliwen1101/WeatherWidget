# WeatherWidget
一款天气应用微信小程序
<p align='center'>
    <img src='https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/weather.jpg'>
</p>

## 说明

I、气象数据由[百度地图开放平台]((https://lbsyun.baidu.com/))修改为了[和风天气](http://www.heweather.com/)，需要注册账号获取 `key`；免费版只能获取三天的天气数据，若要获取七天的气象数据，可以申请个人开发者认证；

II、`d0e51c8` 版本之后为[小程序云开发](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)版本，若未开通云开发功能，为不影响小程序正常运行，可以将版本号回退到 `git reset d0e51c8 --hard`，或，将云开发相关代码注释掉(包括：`app.js` 中的初始化、`index.js` 中获取 `message` 的代码)。若开通了云开发功能，可将相应代码部署到云上。

## 截图
<div >
    <img src='https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/weather1.png' style='max-width:100px!important;width:100px!important;'>
    <img src='https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/weather2.png' style='style='max-width:100px!important;width:100px!important;'>
    <img src='https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/weather3.png' style='style='max-width:100px!important;width:100px!important;'>
    <img src='https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/weather4.png' style='style='max-width:100px!important;width:100px!important;'>
</div>

## 数据来源
气象数据更换为了[和风天气](http://www.heweather.com/)，**使用的是个人开发者认证版**。

## 运行前准备
> * [注册微信小程序](https://mp.weixin.qq.com/wxopen/waregister?action=step1)，获取 `appid`，配置域名白名单(在小程序后台将使用到的 `API` 添加到域名白名单)；
> * 注册[和风天气](http://www.heweather.com/)账号，获取 'key`；
> * 在 `app.js` 中替换 `globalData` 中的 `key` 为你的 `key`；
> * Run and Enjoy!

## 请喝咖啡
如果我的项目对你有帮助，可以请我喝杯咖啡鼓励鼓励哈~

### 支付宝

<img src="https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/zhifubaoshou.png" width="300" /> <img src="https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/zhifubaohong.png" width="300" />

### 微信

<img src="https://raw.githubusercontent.com/zhangliwen1101/Images/master/img/weixinshou.png" width="300" />

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, developed by jack.zhang
