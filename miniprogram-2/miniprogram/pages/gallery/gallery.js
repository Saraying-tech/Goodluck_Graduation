Page({
  data: {
    galleryList: [], 
    selectedCount: 0,
    isAllSelected: false
  },

  /**
   * 每次进入页面都会执行
   */
  onShow() {
    this.getFavoriteData();
  },

  /**
   * 核心逻辑：从缓存加载收藏数据
   */
  getFavoriteData() {
    // 1. 从缓存读取 daily 页面存入的全量列表
    // 注意：请确保你的 daily.js 在收藏时执行了 wx.setStorageSync('artList', this.data.artList)
    const allArtList = wx.getStorageSync('artList') || [];
    
    console.log("读取到缓存总数：", allArtList.length);

    // 2. 过滤出 isFavorite 为 true 的作品
    // map 处理是为了适配 gallery 页面需要的 url 字段和 selected 选中状态
    const favorites = allArtList.filter(item => item.isFavorite).map(item => ({
      ...item,
      url: item.imageUrl, // 映射图片路径
      selected: false     // 初始化管理页的选中状态
    }));
    
    this.setData({ 
      galleryList: favorites,
      selectedCount: 0,
      isAllSelected: false
    });

    if (favorites.length === 0) {
      console.warn("虽然有缓存，但没有 isFavorite 为 true 的作品");
    }
  },

  /**
   * 点击卡片切换选中状态
   */
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    let list = this.data.galleryList;
    
    list.forEach(item => {
      if (item.id === id) {
        item.selected = !item.selected;
      }
    });

    this.setData({ galleryList: list });
    this.updateStatus();
    
    // 增加轻微震动反馈，提升手感
    wx.vibrateShort({ type: 'light' });
  },

  /**
   * 统计当前选中的数量和全选状态
   */
  updateStatus() {
    const list = this.data.galleryList;
    const selCount = list.filter(i => i.selected).length;
    
    this.setData({
      selectedCount: selCount,
      isAllSelected: selCount === list.length && list.length > 0
    });
  },

  /**
   * 底部“全选 / 取消全选”点击事件
   */
  onSelectAll() {
    const target = !this.data.isAllSelected;
    let list = this.data.galleryList.map(item => ({
      ...item,
      selected: target
    }));

    this.setData({ 
      galleryList: list, 
      isAllSelected: target, 
      selectedCount: target ? list.length : 0 
    });
    
    wx.vibrateShort({ type: 'medium' });
  },

  /**
   * 核心逻辑：移出图库（并同步更新缓存）
   */
  onDelete() {
    if (this.data.selectedCount === 0) {
      wx.showToast({ title: '请先选择作品', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '移出确认',
      content: `确定要将这 ${this.data.selectedCount} 件作品从图库移出吗？`,
      confirmColor: '#F07BCD',
      cancelColor: '#999',
      success: (res) => {
        if (res.confirm) {
          // 1. 获取选中的 ID 集合
          const selectedIds = this.data.galleryList
            .filter(item => item.selected)
            .map(item => item.id);
          
          // 2. 更新本地缓存中的原始数据（取消它们的收藏状态）
          let allArtList = wx.getStorageSync('artList') || [];
          allArtList.forEach(item => {
            if (selectedIds.includes(item.id)) {
              item.isFavorite = false;
            }
          });
          
          // 3. 覆盖写回缓存
          wx.setStorageSync('artList', allArtList);
          
          // 4. 重新加载当前页数据
          this.getFavoriteData();
          
          wx.showToast({ title: '已成功移出', icon: 'success' });
        }
      }
    });
  }
});