Page({
  data: {
    selectedStyle: 'cartoon',
    selectedStyleName: '卡通风格',
    styleOptions: [
      { id: 'cartoon', name: '卡通风格', desc: '颜色鲜艳，线条清晰。', img: '/assets/images/style_cartoon.jpg' },
      { id: 'handdrawn', name: '手绘风格', desc: '笔触温暖，线条柔和。', img: '/assets/images/style_hand.jpg' },
      { id: 'watercolor', name: '水彩风格', desc: '颜色柔和晕染，自然细腻。', img: '/assets/images/style_watercolor.jpg' }
    ]
  },

  onLoad() {
    const saved = wx.getStorageSync('user_default_style');
    if (saved) {
      const current = this.data.styleOptions.find(item => item.id === saved);
      this.setData({ 
        selectedStyle: saved,
        selectedStyleName: current ? current.name : '卡通风格'
      });
    }
  },

  selectStyle(e) {
    const { style, name } = e.currentTarget.dataset;
    this.setData({ 
      selectedStyle: style,
      selectedStyleName: name 
    });
    wx.vibrateShort({ type: 'light' });
  },

  onBack() { wx.navigateBack(); },

  onConfirm() {
    wx.showLoading({ title: '正在保存', mask: true });
    wx.setStorageSync('user_default_style', this.data.selectedStyle);
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '设置成功', icon: 'success' });
      setTimeout(() => { wx.navigateBack(); }, 1000);
    }, 600);
  }
});