Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'daily',
    activeFilter: 'all',
    activeValue: 'daily', 
    artList: [
      { id: 1, title: '一起食饭啦', isFavorite: false, tag1: '日常生活', tag2: '手绘风', date: '2026-03-01', imageUrl: '/assets/images/sample1.jpg' },
      { id: 2, title: '你做得好叻啊', isFavorite: true,  tag1: '日常生活', tag2: '卡通风', date: '2026-03-02', imageUrl: '/assets/images/sample2.jpg' },
      { id: 3, title: '彩虹挂系天空', isFavorite: false, tag1: '认知娱乐', tag2: '水彩风', date: '2026-03-03', imageUrl: '/assets/images/sample1.jpg' },
      { id: 4, title: '去超市买水果', isFavorite: false, tag1: '日常生活', tag2: '卡通风', date: '2026-03-04', imageUrl: '/assets/images/sample2.jpg' },
      { id: 5, title: '火车穿过山洞', isFavorite: false, tag1: '认知娱乐', tag2: '手绘风', date: '2026-03-05', imageUrl: '/assets/images/sample1.jpg' },
      { id: 6, title: '感觉好开心',     isFavorite: false, tag1: '情感表达', tag2: '卡通风', date: '2026-03-05', imageUrl: '/assets/images/sample2.jpg' }
    ]
  },

  /**
   * 1. 顶部 Tab 切换
   */
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;
    
    wx.vibrateShort({ type: 'light' });
    this.setData({ 
      currentTab: tab,
      activeFilter: 'all' 
    });
  },

  /**
   * 2. 分类筛选切换
   */
  onFilterTap(e) {
    const filter = e.currentTarget.dataset.filter;
    if (filter === this.data.activeFilter) return;
    
    wx.vibrateShort({ type: 'light' });
    this.setData({ activeFilter: filter });
  },

  /**
   * 3. 核心修正：收藏状态切换并同步缓存
   */
  onToggleFavorite(e) {
    const index = e.currentTarget.dataset.index;
    let artList = this.data.artList;
    const newStatus = !artList[index].isFavorite;

    // 更新当前页面数据
    artList[index].isFavorite = newStatus;
    
    wx.vibrateShort({ type: 'medium' });
    this.setData({ artList });
    
    // 【关键修改：同步到本地缓存，供 gallery 页面读取】
    wx.setStorageSync('artList', artList);
    
    wx.showToast({
      title: newStatus ? '已收藏至图库' : '已移出图库',
      icon: 'success'
    });
  },

  /**
   * 4. 跳转详情页
   */
  toDetail(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.artList[index];
    const currentTab = this.data.currentTab;
    
    wx.vibrateShort({ type: 'light' });

    const detailParams = {
      index: index, 
      title: item.title,
      tag1: item.tag1,
      tag2: item.tag2,
      date: item.date,
      image: item.imageUrl,
      isFavorite: item.isFavorite 
    };

    const dataStr = encodeURIComponent(JSON.stringify(detailParams));
    let targetPage = currentTab === 'daily' ? 'dailydetails' : 'collecteddetails';

    wx.navigateTo({
      url: `/pages/${targetPage}/${targetPage}?data=${dataStr}&type=${currentTab}`,
      events: {
        refreshFavorite: (data) => {
          const { index, isFavorite } = data;
          let list = this.data.artList;
          list[index].isFavorite = isFavorite;
          this.setData({ artList: list });
          // 同步详情页回传的变更到缓存
          wx.setStorageSync('artList', list);
        }
      }
    });
  },

  /**
   * 5. 底部导航切换
   */
  onTabChange(e) {
    const val = e.currentTarget.dataset.value;
    if (val === this.data.activeValue) return;

    wx.vibrateShort({ type: 'light' });

    const routeMap = {
      'home': '/pages/input/input',
      'daily': '/pages/daily/daily',
      'user': '/pages/user/user'
    };

    const targetPath = routeMap[val];

    if (targetPath) {
      wx.reLaunch({
        url: targetPath
      });
    }
  },

  toTalk() {
    wx.vibrateShort({ type: 'medium' });
    wx.reLaunch({ url: '/pages/input/input' });
  },

  /**
   * 6. 核心修正：初始化与显示
   */
  onLoad() {
    // 首次加载时，尝试读取缓存。如果缓存没数据，则初始化缓存
    const cache = wx.getStorageSync('artList');
    if (cache) {
      this.setData({ artList: cache });
    } else {
      wx.setStorageSync('artList', this.data.artList);
    }
    console.log(" 画册管理系统已就绪");
  },

  onShow() {
    this.setData({ activeValue: 'daily' });
    
    const cache = wx.getStorageSync('artList');
    if (cache) {
      this.setData({ artList: cache });
    }
  },

  onPullDownRefresh() {
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '已同步最新内容', icon: 'none' });
    }, 800);
  }
});