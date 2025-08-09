Page({
    data: {
      statusBarHeight: 0,
      topTabs: ['关注', '推荐'],
      activeTopTab: '推荐',
  
      // 图标改成本地 PNG，避免 emoji 首帧丢失
      bottomTabs: [
        { key: 'heart',  icon: '/assets/icons/heart.png',  label: '心动' },
        { key: 'chat',   icon: '/assets/icons/chat.png',   label: '聊天' },
        { key: 'square', icon: '/assets/icons/square.png', label: '广场' },
        { key: 'me',     icon: '/assets/icons/me.png',     label: '我的' }
      ],
      activeBottom: 'square',
  
      bannerList: [],
      posts: [],
      page: 1,
      pageSize: 10,
      refreshing: false,
  
      fallbackImg: '/assets/placeholder.png',
  
      // 本地文件循环（你前面那套）
      bannerFiles: [
        '/assets/banner/banner_a.png',
        '/assets/banner/banner_b.png',
        '/assets/banner/banner_c.png'
      ],
      postFiles: [
        '/assets/post/post_a.png',
        '/assets/post/post_b.png',
        '/assets/post/post_c.png'
      ],
      avatarFiles: [
        '/assets/avatar/avatar1.png',
        '/assets/avatar/avatar2.png',
        '/assets/avatar/avatar3.png'
      ]
    },
  
    onLoad: function () {
      let statusBarHeight = 0;
      try {
        if (typeof wx.getWindowInfo === 'function') {
          statusBarHeight = wx.getWindowInfo().statusBarHeight || 0;
        } else {
          statusBarHeight = wx.getSystemInfoSync().statusBarHeight || 0;
        }
      } catch (e) {}
  
      // 触发一次渲染，确保底栏首帧显示
      this.setData({
        statusBarHeight,
        bottomTabs: this.data.bottomTabs
      });
  
      this.initBanner();
      this.loadInitial();
    },
  
    onShow: function () {
      // 某些版本偶发丢失，补一次
      this.setData({ activeBottom: this.data.activeBottom });
    },
  
    // 循环取本地图片
    makeBannerUrl(i) {
      const files = this.data.bannerFiles;
      return files[i % files.length];
    },
    makePostUrl(id) {
      const files = this.data.postFiles;
      return files[(id - 1) % files.length];
    },
    makeAvatarUrl(id) {
      const files = this.data.avatarFiles;
      return files[(id - 1) % files.length];
    },
  
    initBanner: function () {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        arr.push({ src: this.makeBannerUrl(i) });
      }
      this.setData({ bannerList: arr });
    },
  
    loadInitial: function () {
      this.setData({ page: 1, refreshing: true, posts: [] });
      this.fetchPosts(true);
    },
  
    fetchPosts: function (isRefresh) {
      const { page, pageSize } = this.data;
      const start = (page - 1) * pageSize;
      const list = [];
  
      for (let i = 0; i < pageSize; i++) {
        const id = start + i + 1;
        list.push({
          uuid: `post-${id}`,
          title: `帖子标题 ${id}`,
          authorName: `用户${id}`,
          authorAvatar: this.makeAvatarUrl(id),
          likes: Math.floor(Math.random() * 100),
          imageUrl: this.makePostUrl(id)
        });
      }
  
      setTimeout(() => {
        if (isRefresh) {
          this.setData({ posts: list, refreshing: false });
          wx.stopPullDownRefresh();
        } else {
          this.setData({ posts: this.data.posts.concat(list), refreshing: false });
        }
      }, 200);
    },
  
    // 下拉刷新 / 上拉加载
    onPullDownRefresh: function () {
      if (this.data.refreshing) return;
      this.setData({ refreshing: true });
      this.initBanner();
      this.loadInitial();
    },
    onReachBottom: function () {
      if (this.data.refreshing) return;
      this.setData({ page: this.data.page + 1 });
      this.fetchPosts(false);
    },
  
    // 顶部 Tab
    onTopTabTap: function (e) {
      const key = e.currentTarget.dataset.key;
      if (key === this.data.activeTopTab) return;
      this.setData({ activeTopTab: key });
      this.loadInitial();
    },
  
    // 底部导航
    onBottomTabTap: function (e) {
      const key = e.currentTarget.dataset.key;
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
    onMenuTap: function () {},
  
    // 图片兜底（帖子/头像/Banner）
    onBannerError: function (e) {
      const idx = Number(e.currentTarget.dataset.index || 0);
      const arr = this.data.bannerList.slice();
      if (arr[idx]) {
        arr[idx].src = this.data.fallbackImg;
        this.setData({ bannerList: arr });
      }
    },
    onPostImageError: function (e) {
      const idx = Number(e.currentTarget.dataset.index || 0);
      const key = `posts[${idx}].imageUrl`;
      this.setData({ [key]: this.data.fallbackImg });
    },
    onAvatarError: function (e) {
      const idx = Number(e.currentTarget.dataset.index || 0);
      const key = `posts[${idx}].authorAvatar`;
      this.setData({ [key]: this.data.fallbackImg });
    },
  
    // 底栏图标兜底（可选）
    onBottomIconError: function (e) {
      const key = e.currentTarget.dataset.key;
      const idx = this.data.bottomTabs.findIndex(i => i.key === key);
      if (idx >= 0) {
        const k = `bottomTabs[${idx}].icon`;
        this.setData({ [k]: '/assets/icons/fallback.png' });
      }
    }
  });
  