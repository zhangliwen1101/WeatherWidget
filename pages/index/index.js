let utils = require('../../utils/utils')
let globalData = getApp().globalData
const key = globalData.key
let SYSTEMINFO = globalData.systeminfo
Page({
  data: {
    isIPhoneX: globalData.isIPhoneX,
    message: '',
    cityDatas: {},
    hourlyDatas: [],
    weatherIconUrl: globalData.weatherIconUrl,
    detailsDic: {
      key: ['tmp', 'fl', 'hum', 'pcpn', 'wind_dir', 'wind_deg', 'wind_sc', 'wind_spd', 'vis', 'pres', 'cloud', ''],
      val: {
        tmp: '温度(℃)',
        fl: '体感温度(℃)',
        hum: '相对湿度(%)',
        pcpn: '降水量(mm)',
        wind_dir: '风向',
        wind_deg: '风向角度(deg)',
        wind_sc: '风力(级)',
        wind_spd: '风速(mk/h)',
        vis: '能见度(km)',
        pres: '气压(mb)',
        cloud: '云量',
      },
    },
    lifestyles: {
      'comf': '舒适度指数',
      'cw': '洗车指数',
      'drsg': '穿衣指数',
      'flu': '感冒指数',
      'sport': '运动指数',
      'trav': '旅游指数',
      'uv': '紫外线指数',
      'air': '空气污染扩散条件指数',
      'ac': '空调开启指数',
      'ag': '过敏指数',
      'gl': '太阳镜指数',
      'mu': '化妆指数',
      'airc': '晾晒指数',
      'ptfc': '交通指数',
      'fsh': '钓鱼指数',
      'spi': '防晒指数',
    },
    // 用来清空 input
    searchText: '',
    // 是否已经弹出
    hasPopped: false,
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    // animationThree: {},
    // 是否切换了城市
    located: true,
    // 需要查询的城市
    searchCity: '',
    setting: {},
    bcgImgList: [
      {
        src: '/img/qing.jpg',
        topColor: '#0085e5'
      },
      {
        src: '/img/yu.jpg',
        topColor: '#0e202c'
      },
      {
        src: '/img/xue.jpg',
        topColor: '#0f0e1c'
      },
      {
        src: '/img/yun.jpg',
        topColor: '#004092'
      },
      {
        src: '/img/wu.jpg',
        topColor: '#d3ebf5'
      },
      {
        src: '/img/yin.jpg',
        topColor: '#2d2225'
      },
      {
        src: '/img/bg5.jpg',
        topColor: '#b8bab9'
      },
    ],
    bcgImgIndex: 0,
    bcgImg: '',
    bcgImgAreaShow: false,
    bcgColor: '#2d2225',
    // 粗暴直接：移除后再创建，达到初始化组件的作用
    showHeartbeat: true,
    // heartbeat 时禁止搜索，防止动画执行
    enableSearch: true,
    openSettingButtonShow: false,
    shareInfo: {},
  },
  success (data, location) {
    this.setData({
      openSettingButtonShow: false,
      searchCity: location,
    })
    wx.stopPullDownRefresh()
    let now = new Date()
    // 存下来源数据
    data.updateTime = now.getTime()
    data.updateTimeFormat = utils.formatDate(now, "MM-dd hh:mm")
    wx.setStorage({
      key: 'cityDatas',
      data,
    })
    this.setData({
      cityDatas: data,
    })
  },
  fail(res) {
    wx.stopPullDownRefresh()
    let errMsg = res.errMsg || ''
    // 拒绝授权地理位置权限
    if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
      wx.showToast({
        title: '需要开启地理位置权限',
        icon: 'none',
        duration: 2500,
        success: (res) => {
          if (this.canUseOpenSettingApi()) {
            let timer = setTimeout(() => {
              clearTimeout(timer)
              wx.openSetting({})
            }, 2500)
          } else {
            this.setData({
              openSettingButtonShow: true,
            })
          }
        },
      })
    } else {
      wx.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none',
      })
    }
  },
  commitSearch (res) {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  dance() {
    this.setData({
      enableSearch: false,
    })
    let heartbeat = this.selectComponent('#heartbeat')
    heartbeat.dance(() => {
      this.setData({
        showHeartbeat: false,
        enableSearch: true,
      })
      this.setData({
        showHeartbeat: true,
      })
    })
  },
  clearInput () {
    this.setData({
      searchText: '',
    })
  },
  search (val, callback) {
    if (val === '520' || val === '521') {
      this.clearInput()
      this.dance()
      return
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
    if (val) {
      this.setData({
        located: false,
      })
      this.getWeather(val)
      this.getHourly(val)
    }
    callback && callback()
  },
  // wx.openSetting 要废弃，button open-type openSetting 2.0.7 后支持
  // 使用 wx.canIUse('openSetting') 都会返回 true，这里判断版本号区分
  canUseOpenSettingApi () {
    let systeminfo = getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '2.0.7')
    if (version < 0) {
      return true
    } else {
      return false
    }
  },
  init(params, callback) {
    this.setData({
      located: true,
    })
    wx.getLocation({
      success: (res) => {
        this.getWeather(`${res.latitude},${res.longitude}`)
        this.getHourly(`${res.latitude},${res.longitude}`)
        callback && callback()
      },
      fail: (res) => {
        this.fail(res)
      }
    })
  },
  getWeather (location) {
    wx.request({
      url: `${globalData.requestUrl.weather}`,
      data: {
        location,
        key,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.clearInput()
            this.success(data, location)
            if (data.now.cond_txt.indexOf('晴') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[0].src,
                bcgColor: this.data.bcgImgList[0].topColor,
              })
              this.setNavigationBarColor()
            } else if (data.now.cond_txt.indexOf('雨') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[1].src,
                bcgColor: this.data.bcgImgList[1].topColor,
              })
              this.setNavigationBarColor()
            } else if (data.now.cond_txt.indexOf('雪') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[2].src,
                bcgColor: this.data.bcgImgList[2].topColor,
              })
              this.setNavigationBarColor()
            } else if (data.now.cond_txt.indexOf('云') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[3].src,
                bcgColor: this.data.bcgImgList[3].topColor,
              })
              this.setNavigationBarColor()
            } else if (data.now.cond_txt.indexOf('雾') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[4].src,
                bcgColor: this.data.bcgImgList[4].topColor,
              })
              this.setNavigationBarColor()
            } else if (data.now.cond_txt.indexOf('阴') >= 0) {
              this.setData({
                bcgImg: this.data.bcgImgList[5].src,
                bcgColor: this.data.bcgImgList[5].topColor,
              })
              this.setNavigationBarColor()
            } else {
              this.setData({
                bcgImg: this.data.bcgImgList[6].src,
                bcgColor: this.data.bcgImgList[6].topColor,
              })
              this.setNavigationBarColor()
            }

          } else {
            wx.showToast({
              title: '查询失败',
              icon: 'none',
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
  },
  getHourly(location) {
    wx.request({
      url: `${globalData.requestUrl.hourly}`,
      data: {
        location,
        key,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.setData({
              hourlyDatas: data.hourly || []
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        })
      },
    })
  },
  onPullDownRefresh (res) {
    this.reloadPage()
  },
  getCityDatas() {
    let cityDatas = wx.getStorage({
      key: 'cityDatas',
      success: (res) => {
        this.setData({
          cityDatas: res.data,
        })
        if (res.data.now.cond_txt.indexOf('晴') >= 0){
          this.setData({
            bcgImg: this.data.bcgImgList[0].src,
            bcgColor: this.data.bcgImgList[0].topColor,
          })
          this.setNavigationBarColor()
        } else if (res.data.now.cond_txt.indexOf('雨') >= 0){
          this.setData({
            bcgImg: this.data.bcgImgList[1].src,
            bcgColor: this.data.bcgImgList[1].topColor,
          })
          this.setNavigationBarColor()
        } else if (res.data.now.cond_txt.indexOf('雪') >= 0){
          this.setData({
            bcgImg: this.data.bcgImgList[2].src,
            bcgColor: this.data.bcgImgList[2].topColor,
          })
          this.setNavigationBarColor()
        } else if (res.data.now.cond_txt.indexOf('云') >= 0){
          this.setData({
            bcgImg: this.data.bcgImgList[3].src,
            bcgColor: this.data.bcgImgList[3].topColor,
          })
          this.setNavigationBarColor()
        } else if (res.data.now.cond_txt.indexOf('雾') >= 0){
          this.setData({
            bcgImg: this.data.bcgImgList[4].src,
            bcgColor: this.data.bcgImgList[4].topColor,
          })
          this.setNavigationBarColor()
        } else if (res.data.now.cond_txt.indexOf('阴') >= 0){
          this.setData({
            bcgImg: this.data.bcgImgList[5].src,
            bcgColor: this.data.bcgImgList[5].topColor,
          })
          this.setNavigationBarColor()
        }else{
          this.setData({
            bcgImg: this.data.bcgImgList[6].src,
            bcgColor: this.data.bcgImgList[6].topColor,
          })
          this.setNavigationBarColor()
        }
      },
    })
  },
  setNavigationBarColor (color) {
    let bcgColor = color || this.data.bcgColor
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.bcgColor,
    })
  },
  menuMainMove(e) {
    // 如果已经弹出来了，需要先收回去，否则会受 top、left 会影响
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
    let windowWidth = SYSTEMINFO.windowWidth
    let windowHeight = SYSTEMINFO.windowHeight
    let touches = e.touches[0]
    let clientX = touches.clientX
    let clientY = touches.clientY
    // 边界判断
    if (clientX > windowWidth - 40) {
      clientX = windowWidth - 40
    }
    if (clientX <= 90) {
      clientX = 90
    }
    if (clientY > windowHeight - 40 - 60) {
      clientY = windowHeight - 40 - 60
    }
    if (clientY <= 60) {
      clientY = 60
    }
    let pos = {
      left: clientX,
      top: clientY,
    }
    this.setData({
      pos,
    })
  },
  getBroadcast (callback) {
    wx.cloud.callFunction({
      name: 'getBroadcast',
      data: {
        hour: new Date().getHours(),
      },
    })
    .then(res => {
      let data = res.result.data
      if (data) {
        callback && callback(data[0].message)
      }
    })
  },
  reloadGetBroadcast () {
    this.getBroadcast((message) => {
      this.setData({
        message,
      })
    })
  },
  reloadWeather () {
    if (this.data.located) {
      this.init({})
    } else {
      this.search(this.data.searchCity)
      this.setData({
        searchCity: '',
      })
    }
  },
  onShow() {
    // onShareAppMessage 要求同步返回
    if (!utils.isEmptyObject(this.data.shareInfo)) {
      return
    }
    wx.cloud.callFunction({
      name: 'getShareInfo',
    })
    .then(res => {
      let shareInfo = res.result
      if (shareInfo) {
        if (!utils.isEmptyObject(shareInfo)) {
          this.setData({
            shareInfo,
          })
        }
      }
    })
  },
  onLoad () {
    this.reloadPage()
  },
  reloadPage () {
    // this.setBcgImg()
    this.getCityDatas()
    this.reloadInitSetting()
    this.reloadWeather()
    this.reloadGetBroadcast()
  },
  checkUpdate (setting) {
    // 兼容低版本
    if (!setting.forceUpdate || !wx.getUpdateManager) {
      return
    }
    let updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((res) => {
      console.error(res)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已下载完成，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  // showBcgImgArea () {
  //   this.setData({
  //     bcgImgAreaShow: true,
  //   })
  // },
  hideBcgImgArea () {
    this.setData({
      bcgImgAreaShow: false,
    })
  },
  // chooseBcg (e) {
  //   let dataset = e.currentTarget.dataset
  //   let src = dataset.src
  //   let index = dataset.index
  //   this.setBcgImg(index)
  //   wx.setStorage({
  //     key: 'bcgImgIndex',
  //     data: index,
  //   })
  // },
  // toCitychoose () {
  //   wx.navigateTo({
  //     url: '/pages/citychoose/citychoose',
  //   })
  // },
  initSetting (successFunc) {
    wx.getStorage({
      key: 'setting',
      success: (res) => {
        let setting = res.data || {}
        this.setData({
          setting,
        })
        successFunc && successFunc(setting)
      },
      fail: () => {
        this.setData({
          setting: {},
        })
      },
    })
  },
  reloadInitSetting () {
    this.initSetting((setting) => {
      this.checkUpdate(setting)
    })
  },
  onShareAppMessage (res) {
    let shareInfo = this.data.shareInfo
    return {
      title: shareInfo.title || '天气早知道',
      path: shareInfo.path || '/pages/index/index',
      imageUrl: '/img/share.jpg',
    }
  },
  menuHide () {
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  menuMain () {
    if (!this.data.hasPopped) {
      this.popp()
      this.setData({
        hasPopped: true,
      })
    } else {
      this.takeback()
      this.setData({
        hasPopped: false,
      })
    }
  },
  menuToCitychoose () {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/citychoose/citychoose',
    })
  },
  menuToSetting () {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },
  menuToAbout () {
    this.menuMain()
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  popp() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step()
    animationOne.translate(-30, -45).rotateZ(180).opacity(1).step()
    animationTwo.translate(-75, 0).rotateZ(180).opacity(1).step()
    animationFour.translate(-30, 45).rotateZ(180).opacity(1).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationFour: animationFour.export(),
    })
  },
  takeback() {
    let animationMain = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step();
    animationOne.translate(0, 0).rotateZ(0).opacity(0).step()
    animationTwo.translate(0, 0).rotateZ(0).opacity(0).step()
    animationFour.translate(0, 0).rotateZ(0).opacity(0).step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationFour: animationFour.export(),
    })
  },
})