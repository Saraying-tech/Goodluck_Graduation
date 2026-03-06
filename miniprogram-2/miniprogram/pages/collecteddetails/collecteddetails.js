Page({
  data: {
    imageUrl: '',
    contentText: '',
    dateText: '',
    feedbackLabel: '满意'
  },

  onLoad(options) {
    if (options.data) {
      try {
        const detail = JSON.parse(decodeURIComponent(options.data));
        this.setData({
          imageUrl: detail.image,
          contentText: detail.title,
          dateText: detail.date || '2026-03-05 14:20'
        });
      } catch (e) {
        console.error("解析详情数据失败", e);
      }
    }
  },

  /**
   * 返回上一页（画册列表）
   */
  onBack() { 
    wx.vibrateShort({ type: 'light' });
    wx.navigateBack(); 
  },

  /**
   * 核心修改：点击再说一句，重置并回到首页
   */
  toTalk() { 
    wx.vibrateShort({ type: 'medium' });
    
    // 使用 reLaunch 确保首页状态被彻底刷新
    wx.reLaunch({ 
      url: '/pages/input/input',
      success: () => {
        console.log("已从详情页回到首页");
      },
      fail: (err) => {
        console.error("回到首页失败", err);
        // 保底方案
        wx.switchTab({ url: '/pages/input/input' });
      }
    }); 
  },

  onRebuild() { 
    wx.vibrateShort({ type: 'light' });
    wx.showLoading({ title: '正在重新生成...' });
    
    // 模拟异步请求
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '已更新风格', icon: 'success' });
    }, 1000);
  }
});