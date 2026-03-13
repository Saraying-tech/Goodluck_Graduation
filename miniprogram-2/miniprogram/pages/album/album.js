Page({
  data: {
    imageUrl: '/assets/images/style_cartoon.jpg',
    styleTag: '卡通风格',
    dateText: '2026.03.04',
    contentText: '今日去超市买苹果',

    // 默认不选中
    selectedEmoji: ''
  },

  selectEmoji(e) {
    const type = e.currentTarget.dataset.type;

    this.setData({
      selectedEmoji: type
    });

    wx.vibrateShort({ type: 'light' });
  },

  onBack() {
    wx.vibrateShort({ type: 'medium' });

    wx.showLoading({
      title: '重新生成中...'
    });

    // 模拟生成延迟
    setTimeout(() => {

      const now = new Date();
      const timeText = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

      this.setData({
        imageUrl: '/assets/images/style_cartoon.jpg?' + Date.now(), // 强制刷新
        dateText: timeText,
        contentText: '今天去公园玩滑滑梯',
        selectedEmoji: '' // 清空反馈
      });

      wx.hideLoading();

      wx.showToast({
        title: '已重新生成',
        icon: 'success'
      });

    }, 1000);
  },

  onConfirm() {
    wx.vibrateShort({ type: 'medium' });

    wx.reLaunch({
      url: '/pages/input/input'
    });
  },

  /**
   * 保存图片
   */
  onSaveImage() {
    const that = this;
    wx.vibrateShort({ type: 'medium' });

    wx.showLoading({ title: '正在保存...' });

    wx.saveImageToPhotosAlbum({
      filePath: that.data.imageUrl,
      success() {
        wx.hideLoading();
        wx.showToast({
          title: '已保存到相册',
          icon: 'success'
        });
      },
      fail() {
        wx.hideLoading();
        wx.showToast({
          title: '演示模式：保存成功',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '看，这是我为孩子生成的绘本插画！',
      path: '/pages/daily/daily',
      imageUrl: this.data.imageUrl
    };
  }
});
