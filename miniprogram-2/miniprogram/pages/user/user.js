Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeValue: 'user', // 当前页面标识，对应底部导航高亮
    userInfo: {
      nickname: '陈妈妈',
      avatar: 'C'
    },
    stats: {
      exchange: 128,  // 交流量
      adopt: 98,      // 采纳量
      share: 104,     // 分享量
      favorite: 47    // 收藏量
    }
  },

  /**
   * 1. 底部导航切换 (核心逻辑：使用 reLaunch 保持页面栈干净)
   */
  onTabChange(e) {
    const val = e.currentTarget.dataset.value;
    console.log("【底部导航】点击了:", val);

    // 如果点击的是当前“我的”页，则不重复跳转
    if (val === this.data.activeValue) return;

    wx.vibrateShort({ type: 'light' });

    // 路径映射表：确保与 app.json 中的路径完全一致
    const routeMap = {
      'home': '/pages/input/input',
      'daily': '/pages/daily/daily',
      'user': '/pages/user/user'
    };

    const targetPath = routeMap[val];

    if (targetPath) {
      wx.reLaunch({
        url: targetPath,
        success: () => {
          console.log(` 成功切换至 ${val} 模块`);
        },
        fail: (err) => {
          console.error(" 导航失败:", err);
          wx.showToast({ title: '页面路径错误', icon: 'none' });
        }
      });
    }
  },

  /**
   * 2. 菜单项跳转 (使用 navigateTo 以便用户可以点击左上角返回)
   */
  navTo(e) {
    const urlType = e.currentTarget.dataset.url; // 从 WXML 的 data-url 获取值
    wx.vibrateShort({ type: 'light' });

    console.log(" 准备进入功能页:", urlType);

    // 二级页面路径映射
    const menuMap = {
      'style': '/pages/style/style',      // 我的画风
      'gallery': '/pages/gallery/gallery',    // 画库管理 (跳转至画册页)
      'guide': '/pages/guide/guide',      // 家长指南
      'about': '/pages/about/about'       // 关于本研究
    };

    const targetUrl = menuMap[urlType];

    if (targetUrl) {
      wx.navigateTo({
        url: targetUrl,
        success: () => {
          console.log(` 成功打开: ${urlType}`);
        },
        fail: (err) => {
          console.error(" 跳转二级页面失败:", err);
          // 友好提示：如果页面还没在 app.json 注册或还没创建文件夹
          wx.showToast({
            title: '功能正在努力开发中',
            icon: 'none'
          });
        }
      });
    } else {
      console.warn(" 映射表中未找到该路径标识:", urlType);
    }
  },

  /**
   * 3. 退出登录逻辑
   */
  onLogout() {
    wx.showModal({
      title: '温馨提示',
      content: '确定要退出登录吗？',
      confirmText: '确定退出',
      confirmColor: '#F07BCD', // 统一使用你的粉色主题色
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.vibrateShort({ type: 'medium' });
          console.log(" 用户已退出登录");
          
          // 退出后通常回滚到首页
          wx.reLaunch({
            url: '/pages/input/input',
            success: () => {
              wx.showToast({ title: '已安全退出', icon: 'success' });
            }
          });
        }
      }
    });
  },

  /**
   * 4. 页面显示时的状态校准
   */
  onShow() {
    // 确保从二级页面（如“我的画风”）返回时，底部导航的“我的”依然高亮
    this.setData({ 
      activeValue: 'user' 
    });
    console.log("👤 个人中心已就绪");
  },

  /**
   * 生命周期 - 监听页面加载
   */
  onLoad(options) {
    // 这里未来可以添加从服务器获取最新 userInfo 或 stats 的代码
  }
});