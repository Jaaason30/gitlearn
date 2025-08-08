// miniprogram/pages/square/index.js
Page({
    data: {
      statusBarHeight: 0,
      fabSize: 112,          // 对应 56px * 2
      fabBottom: 60,         // 对应 FAB_BOTTOM(30px)*2
  
      topTabs: ['关注', '推荐'],
      activeTopTab: '推荐',
  
      bottomTabs: [
        { key: 'heart',   icon: 'like',    label: '心动' },
        { key: 'chat',    icon: 'comment', label: '聊天' },
        { key: 'square',  icon: 'grid',    label: '广场' },
        { key: 'me',      icon: 'user',    label: '我的' },
      ],
      activeBottom: 'square',
  
      // 先用随机图占位
      bannerList: [],
  
      // 帖子列表占位
      posts: [],
      page: 1,
      pageSize: 10,
      refreshing: false,
  
      sheetVisible: false,
    },
  
    onLoad() {
      const sys = wx.getSystemInfoSync();
      this.setData({ statusBarHeight: sys.statusBarHeight });
  
      // 初始化随机 banner
      this.initBanner();
      // 初次加载假数据
      this.loadInitial();
    },
  
    // 用 Picsum 随机图占位 Banner
    initBanner() {
      const bannerList = Array.from({ length: 3 }).map((_, idx) => ({
        src: `https://picsum.photos/750/280?random=${Date.now() + idx}`
      }));
      this.setData({ bannerList });
    },
  
    loadInitial() {
      this.setData({
        page: 1,
        refreshing: true,
        posts: []
      }, () => this.fetchPosts(true));
    },
  
    fetchPosts(isRefresh = false) {
      const { page, pageSize, posts } = this.data;
      // ↓ 如需接真实接口，可把下面这一段注释去掉
      /*
      wx.request({
        url: 'https://api.example.com/posts',
        data: { page, pageSize, tab: this.data.activeTopTab },
        success: ({ data }) => {
          const list = data.list || [];
          this.setData({
            posts: isRefresh ? list : posts.concat(list),
            refreshing: false
          });
          if (isRefresh) wx.stopPullDownRefresh();
        },
        fail: () => {
          this.setData({ refreshing: false });
          wx.stopPullDownRefresh();
        }
      });
      return;
      */
  
      // —— 以下为假数据生成逻辑 —— 
      const start = (page - 1) * pageSize;
      const list = Array.from({ length: pageSize }).map((_, i) => {
        const id = start + i + 1;
        return {
          uuid: `post-${id}`,
          title: `帖子标题 ${id}`,
          authorName: `用户${id}`,
          authorAvatar: `https://i.pravatar.cc/40?img=${(id % 70) + 1}`,
          likes: Math.floor(Math.random() * 100),
          imageUrl: `https://picsum.photos/300/390?random=${Date.now() + id}`
        };
      });
  
      // 模拟网络延迟
      setTimeout(() => {
        this.setData({
          posts: isRefresh ? list : posts.concat(list),
          refreshing: false
        });
        if (isRefresh) wx.stopPullDownRefresh();
      }, 300);
    },
  
    // 下拉刷新
    onPullDownRefresh() {
      this.setData({ refreshing: true });
      this.loadInitial();
    },
  
    // 上拉加载
    onReachBottom() {
      this.setData({ page: this.data.page + 1 }, () => this.fetchPosts());
    },
  
    // 顶部 Tab 切换
    onTopTabTap(e) {
      const key = e.currentTarget.dataset.key;
      this.setData({ activeTopTab: key }, () => this.loadInitial());
    },
  
    // 底部导航切换
    onBottomTabTap(e) {
      const key = e.currentTarget.dataset.key;
      this.setData({ activeBottom: key });
      if (key === 'square') {
        this.loadInitial();
      } else if (key === 'me') {
        wx.navigateTo({ url: '/pages/profile/index' });
      } else if (key === 'heart') {
        wx.navigateTo({ url: '/pages/heart/index' });
      } else {
        wx.navigateTo({ url: '/pages/chat/index' });
      }
    },
  
    onSearchTap() {
      wx.navigateTo({ url: '/pages/search/index' });
    },
  
    onMenuTap() {
      // 打开侧边菜单或自定义操作
    },
  
    onFabTap() {
      this.setData({ sheetVisible: true });
    },
  
    onActionSheetClose() {
      this.setData({ sheetVisible: false });
    },
    onSelectGallery()    { /* ... */ },
    onTakePhoto()        { /* ... */ },
    onTextPost()         { /* ... */ },
    onTemplatePost()     { /* ... */ },
  });
  