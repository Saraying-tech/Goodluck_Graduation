Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeValue: 'home', // 导航高亮状态
    isRecording: false,  // 录音状态
    isProcessing: false  // 全局处理锁
  },

  /**
   * 1. 自定义导航栏切换逻辑 (参考 daily.js 成功经验版)
   */
  onTabChange(e) {
    const val = e.currentTarget.dataset.value;
    console.log("【首页导航点击】收到键值:", val);

    // 基础防错：无值、正在处理中，则拦截
    if (!val || this.data.isProcessing) return;

    // 如果点击的是当前页面（home），不需要跳转，直接拦截
    if (val === 'home' || val === this.data.activeValue) return;

    wx.vibrateShort({ type: 'light' });

    /**
     * 路径映射表：显式指定路径，避免拼接出错
     */
    const routeMap = {
      'home': '/pages/input/input',
      'daily': '/pages/daily/daily',
      'user': '/pages/user/user'
    };

    const targetPath = routeMap[val];

    if (!targetPath) {
      console.error(" 映射表中未找到路径:", val);
      return;
    }

    console.log(" 准备执行最高级跳转 (reLaunch):", targetPath);

    // 更新高亮状态（虽然 reLaunch 会刷新页面，但保持逻辑完整）
    this.setData({ activeValue: val });

    /**
     * 关键修正：参考 daily.js 使用 wx.reLaunch
     * 解决页面栈堆叠导致的“跳不动”问题
     */
    wx.reLaunch({
      url: targetPath,
      success: () => {
        console.log(" 首页发起跳转成功:", targetPath);
      },
      fail: (err) => {
        console.error(" 跳转失败，请检查 app.json 路径:", err);
        wx.showToast({
          title: '页面加载失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 2. 录音逻辑 (保持原有优化)
   */
  onStartRecord() {
    if (this.data.isProcessing) return;
    this.setData({ isRecording: true });
    wx.vibrateShort({ type: 'medium' });
  },

  onStopRecord() {
    if (!this.data.isRecording || this.data.isProcessing) {
      this.setData({ isRecording: false });
      return;
    }

    this.setData({ isRecording: false, isProcessing: true });
    wx.vibrateShort({ type: 'light' });
    
    wx.showLoading({ title: '粤语识别中...', mask: true });

    setTimeout(() => {
      wx.hideLoading({
        success: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/text/text',
              success: () => { this.setData({ isProcessing: false }); },
              fail: () => { this.setData({ isProcessing: false }); }
            });
          }, 100);
        }
      });
    }, 1200);
  },

  /**
   * 3. 页面显示重置
   */
  onShow() {
    // 确保回到首页时，高亮和状态都是干净的
    this.setData({ 
      activeValue: 'home',
      isProcessing: false,
      isRecording: false
    });
    console.log(" 首页状态已重置就绪");
  }
});