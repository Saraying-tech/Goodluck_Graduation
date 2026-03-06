Page({
  data: {
    selectedStyle: 'cartoon', // 默认选中卡通风格
    inputText: '今日去超市买苹果', // 建议把识别的文字存入 data，方便后期修改
    wordCount: 8 // 字数统计
  },

  selectStyle(e) {
    const style = e.currentTarget.dataset.style;
    
    // 如果点击的已经是选中的，不做多余操作
    if (style === this.data.selectedStyle) return;

    this.setData({
      selectedStyle: style
    });

    // 触感反馈
    wx.vibrateShort({ type: 'light' });
    console.log("当前选择风格：", style);
  },

  onInputChange(e) {
    const value = e.detail.value;
    this.setData({
      inputText: value,
      wordCount: value.length
    });
  },

  /**
   * 重新录音：返回上一页 (input 页)
   */
  onBack() {
    wx.vibrateShort({ type: 'light' });
    
    // 使用 navigateBack 会保留 input 页面的状态（比如不用重新加载背景）
    wx.navigateBack({
      delta: 1,
      fail() {
        // 如果直接打开的本页，则兜底跳回 input
        wx.reLaunch({ url: '/pages/input/input' });
      }
    });
  },

  /**
   * 确认生成：跳转到画册/生成页
   */
  onConfirm() {
    // 1. 较重的震动反馈，表示“确定”核心操作
    wx.vibrateShort({ type: 'medium' });

    // 2. 加载动画：模拟 AI 绘图的耗时过程
    wx.showLoading({ 
      title: 'AI 正在绘画中...',
      mask: true // 开启蒙层，防止用户在生成时乱点
    });
    
    // 3. 模拟接口请求过程
    // 实际开发中，这里应该调用后端接口，把 this.data.inputText 和 selectedStyle 传过去
    setTimeout(() => {
      wx.hideLoading();

      // 跳转到画册页
      // 如果 album 是 TabBar 页面，请改用 wx.switchTab
      wx.navigateTo({ 
        url: '/pages/album/album',
        success: () => {
          console.log("生成成功，前往画册");
        }
      });
    }, 2500); // 建议设为 2.5 秒，给用户一点“AI 正在思考”的心理预期
  }
});