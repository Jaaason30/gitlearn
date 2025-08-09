// 纯小程序原生写法；无 import/require，无 Babel helper
Page({
    data: {
      statusBarHeight: 0,
  
      topTabs: ['关注', '推荐'],
      activeTopTab: '推荐',
  
      bottomTabs: [
        { key: 'heart',  icon: '❤️', label: '心动' },
        { key: 'chat',   icon: '💬', label: '聊天' },
        { key: 'square', icon: '🔲', label: '广场' },
        { key: 'me',     icon: '👤', label: '我的' }
      ],
      activeBottom: 'square',
  
      bannerList: [],
      posts: [],
      page: 1,
      pageSize: 10,
      refreshing: false,
  
      // 本地兜底图（请在项目放一张 /assets/placeholder.png）
      fallbackImg: '/assets/placeholder.png'
      
    },
  
    onLoad: function () {
      var sys = wx.getSystemInfoSync();
      // 触发一次 setData，避免首屏 emoji 渲染延迟
      this.setData({
        statusBarHeight: sys.statusBarHeight,
        bottomTabs: this.data.bottomTabs
      });
  
      this.initBanner();
      this.loadInitial();
    },
  
    // 使用 via.placeholder.com（稳定）做占位图
    initBanner: function () {
      var now = Date.now();
      var arr = [];
      for (var i = 0; i < 3; i++) {
        arr.push({
          src: 'https://via.placeholder.com/750x280.png?text=Banner+' + (i + 1) + '&t=' + (now + i)
        });
      }
      this.setData({ bannerList: arr });
    },
  
    loadInitial: function () {
      this.setData({ page: 1, refreshing: true, posts: [] });
      this.fetchPosts(true);
    },
  
    fetchPosts: function (isRefresh) {
      var page = this.data.page;
      var pageSize = this.data.pageSize;
      var start = (page - 1) * pageSize;
      var list = [];
      for (var i = 0; i < pageSize; i++) {
        var id = start + i + 1;
        var avatarIdx = ((id - 1) % 70) + 1; // 1..70
        list.push({
          uuid: 'post-' + id,
          title: '帖子标题 ' + id,
          authorName: '用户' + id,
          authorAvatar: 'https://i.pravatar.cc/40?img=' + avatarIdx,
          likes: Math.floor(Math.random() * 100),
          imageUrl: 'https://via.placeholder.com/300x390.png?text=Post+' + id
        });
      }
  
      var that = this;
      setTimeout(function () {
        if (isRefresh) {
          that.setData({ posts: list, refreshing: false });
          wx.stopPullDownRefresh();
        } else {
          that.setData({ posts: that.data.posts.concat(list), refreshing: false });
        }
      }, 200);
    },
  
    // 下拉刷新
    onPullDownRefresh: function () {
      if (this.data.refreshing) return;
      this.setData({ refreshing: true });
      this.initBanner();
      this.loadInitial();
    },
  
    // 上拉加载
    onReachBottom: function () {
      if (this.data.refreshing) return;
      this.setData({ page: this.data.page + 1 });
      this.fetchPosts(false);
    },
  
    // 顶部 Tab 切换
    onTopTabTap: function (e) {
      var key = e.currentTarget.dataset.key;
      if (key === this.data.activeTopTab) return;
      this.setData({ activeTopTab: key });
      this.loadInitial();
    },
  
    // 底部导航切换
    onBottomTabTap: function (e) {
      var key = e.currentTarget.dataset.key;
      this.setData({ activeBottom: key });
      if (key === 'square') {
        this.loadInitial();
      } else if (key === 'heart') {
        wx.navigateTo({ url: '/pages/heart/index' });
      } else if (key === 'chat') {
        wx.navigateTo({ url: '/pages/chat/index' });
      } else if (key === 'me') {
        wx.navigateTo({ url: '/pages/profile/index' });
      }
    },
  
    onSearchTap: function () { wx.navigateTo({ url: '/pages/search/index' }); },
    onMenuTap: function () { /* 自定义 */ },
  
    // 图片兜底
    onBannerError: function (e) {
      var idx = Number(e.currentTarget.dataset.index || 0);
      var arr = this.data.bannerList.slice();
      if (arr[idx]) {
        arr[idx].src = this.data.fallbackImg;
        this.setData({ bannerList: arr });
      }
    },
    onPostImageError: function (e) {
      var idx = Number(e.currentTarget.dataset.index || 0);
      var key = 'posts[' + idx + '].imageUrl';
      this.setData({ [key]: this.data.fallbackImg });
    },
    onAvatarError: function (e) {
      var idx = Number(e.currentTarget.dataset.index || 0);
      var key = 'posts[' + idx + '].authorAvatar';
      this.setData({ [key]: this.data.fallbackImg });
    },
    handleBannerError(e) {
        const idx = Number(e.currentTarget.dataset.index || 0);
        const list = this.data.bannerList.slice();
        if (list[idx]) {
          list[idx].src = this.data.fallbackImg;
          this.setData({ bannerList: list });
        }
      },
    
      handlePostImageError(e) {
        const idx = Number(e.currentTarget.dataset.index || 0);
        // posts[idx].imageUrl -> fallback
        const key = `posts[${idx}].imageUrl`;
        this.setData({ [key]: this.data.fallbackImg });
      },
    
      handleAvatarError(e) {
        const idx = Number(e.currentTarget.dataset.index || 0);
        const key = `posts[${idx}].authorAvatar`;
        this.setData({ [key]: this.data.fallbackImg });
      },
    });
  