// pages/input/input.ts
Page({
  data: {
    activeValue: 'home',
    isRecording: false,
    isProcessing: false
  },

  /**
   * 1. 开始录音
   */
  onStartRecord() {
    if (this.data.isProcessing) return;
    this.setData({ isRecording: true });
    wx.vibrateShort({ type: 'medium' });
    console.log("🎙️ 开始录音");
  },

  /**
   * 2. 停止录音并处理跳转
   */
  onStopRecord() {
    if (this.data.isProcessing) return;

    this.setData({ isRecording: false, isProcessing: true });
    wx.vibrateShort({ type: 'light' });

    wx.showLoading({
      title: '识别中...',
      mask: true
    });

    // 模拟识别逻辑
    setTimeout(() => {
      wx.hideLoading({
        success: () => {
          wx.navigateTo({
            url: '/pages/text/text',
            success: () => {
              this.setData({ isProcessing: false });
            },
            fail: (err) => {
              console.error("跳转失败", err);
              this.setData({ isProcessing: false });
              wx.showToast({ title: '跳转失败', icon: 'none' });
            }
          });
        }
      });
    }, 800);
  },

  /**
   * 3. 修正后的底部导航切换 (重点修改这里)
   */
  onTabChange(e: any) {
    const val = e.currentTarget.dataset.value;
    console.log("【首页导航】目标值:", val);

    // 基础拦截：正在处理中，或者点击的就是当前页
    if (!val || this.data.isProcessing) return;
    if (val === 'home') return; 

    wx.vibrateShort({ type: 'light' });

    // 完善路径映射表
    const routeMap: Record<string, string> = {
      'home': '/pages/input/input',
      'daily': '/pages/daily/daily',
      'user': '/pages/user/user'
    };

    const targetPath = routeMap[val];

    if (targetPath) {
      console.log("🚀 执行跳转至:", targetPath);
      // 使用 reLaunch 彻底解决“跳不动”的问题，并重置页面栈
      wx.reLaunch({
        url: targetPath,
        fail: (err) => {
          console.error("🚨 跳转失败，请检查 app.json 是否注册路径:", err);
          wx.showToast({ title: '页面未找到', icon: 'none' });
        }
      });
    } else {
      console.error("🚨 未定义的 dataset-value:", val);
    }
  },

  onShow() {
    // 确保回到首页时重置所有状态
    this.setData({
      activeValue: 'home',
      isProcessing: false,
      isRecording: false
    });
  }
})