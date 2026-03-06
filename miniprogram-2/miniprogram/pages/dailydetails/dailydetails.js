Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 1. 收藏状态
    isFavorite: false, 
    itemIndex: null, // 【新增】保存数据的索引，用于同步回列表页

    // 接收到的动态数据
    imageUrl: '',
    contentText: '',
    dateText: '',
    styleTag: '',
    pageType: '', // 来源：daily 或 gallery

    // 表情反馈配置
    selectedEmoji: 'satisfied', // 默认选中满意
    emojiList: [
      { type: 'satisfied', label: '满意' },
      { type: 'happy', label: '开心' },
      { type: 'laugh', label: '大笑' },
      { type: 'lost', label: '失落' },
      { type: 'sad', label: '忧伤' },
      { type: 'cry', label: '大哭' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1. 获取从列表页传过来的 data 字符串
    if (options.data) {
      try {
        // 2. 解码并转回对象
        const detail = JSON.parse(decodeURIComponent(options.data));
        
        // 3. 将数据映射到页面 data 中
        this.setData({
          imageUrl: detail.image,
          contentText: detail.title,
          styleTag: detail.tag2,
          pageType: options.type || 'daily',
          isFavorite: detail.isFavorite || false,
          itemIndex: detail.index // 【重要】保存索引
        });

        console.log("【详情页】渲染成功:", detail.title);
      } catch (e) {
        console.error("【详情页】解析数据失败:", e);
      }
    }
  },

  /**
   * 增加 eventChannel 通信，确保列表页实时显示
   */
  onToggleFavorite() {
    const newStatus = !this.data.isFavorite;
    
    this.setData({
      isFavorite: newStatus
    });

    // 【核心改动】向列表页发送同步信号
    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel && eventChannel.emit) {
      eventChannel.emit('refreshFavorite', {
        index: this.data.itemIndex,
        isFavorite: newStatus
      });
    }

    wx.vibrateShort({ type: 'medium' });

    if (newStatus) {
      wx.showToast({
        title: '已保存至图库',
        icon: 'success',
        duration: 1500
      });
    } else {
      wx.showToast({
        title: '已从图库移除',
        icon: 'none',
        duration: 1500
      });
    }
  },

  /**
   * 默认分享逻辑
   */
  onShare() {
    wx.vibrateShort({ type: 'light' });
    console.log("【动作】点击了分享按钮");
  },

  /**
   * 孩子反馈：点击选择表情
   */
  selectEmoji(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ selectedEmoji: type });
    wx.vibrateShort({ type: 'light' });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 跳转到对话页
   */
  toTalk() {
    wx.vibrateShort({ type: 'medium' });
    wx.navigateTo({
      url: '/pages/input/input' 
    });
  }
})