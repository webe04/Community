<template>
  <div class="student-home">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item active">首页</a>
          <a class="nav-item" @click="$router.push('/student/club')">社团浏览</a>
          <a class="nav-item" @click="$router.push('/student/activity')">活动中心</a>
          <a class="nav-item" @click="$router.push('/student/my-join')">我的社团</a>
          <a class="nav-item" @click="$router.push('/student/profile')">个人信息</a>
        </nav>
        <div class="user-info">
          <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" @error="setDefaultAvatar" />
          <span class="welcome-text">欢迎，{{ userInfo.name || '同学' }}</span>
          <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </div>
    </header>

    <div class="main-container">
      <el-carousel height="400px" arrow="always" class="banner-carousel">
        <el-carousel-item v-for="(banner, index) in bannerList" :key="'banner-' + index">
          <img :src="getImgUrl(banner.imgUrl)" class="swiper-img" @error="setDefaultAvatar" />
        </el-carousel-item>
      </el-carousel>

      <div class="notice-section">
        <div class="section-header">
          <span class="title-text"><i class="el-icon-bell"></i> 通知公告</span>
          <el-button type="text">更多 <i class="el-icon-d-arrow-right"></i></el-button>
        </div>
        <div class="notice-list">
          <div v-for="newsItem in newsList" :key="newsItem.id" class="notice-item" @click="toNewsDetail(newsItem.id)">
            <div class="notice-main">
              <i class="el-icon-caret-right"></i>
              <span class="notice-title">{{ newsItem.title }}</span>
            </div>
            <span class="notice-date">{{ formatTime(newsItem.publishTime) }}</span>
          </div>
          <el-empty v-if="newsList.length === 0" description="暂无公告" :image-size="100"></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { userInfo: {}, bannerList: [], newsList: [] };
  },
  created() {
    const user = localStorage.getItem("loginUser");
    if (!user) { this.$router.push("/login"); return; }
    this.userInfo = JSON.parse(user);
    this.$axios.get("/api/home/banner?type=0").then(res => { this.bannerList = res.data.data || []; });
    this.$axios.get("/api/home/news").then(res => { this.newsList = res.data.data || []; });
  },
  methods: {
    getImgUrl(path) {
      const baseUrl = 'http://localhost:9090';
      if (!path) return baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
      let realPath = typeof path === 'object' ? (path.imgUrl || path.url) : path;
      realPath = realPath.replace('/api', '');
      return realPath.startsWith('http') ? realPath : baseUrl + (realPath.startsWith('/') ? '' : '/') + realPath;
    },
    setDefaultAvatar(e) { e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; },
    logout() { localStorage.removeItem("loginUser"); this.$router.push("/login"); },
    toNewsDetail(newsId) { this.$router.push({ name: 'NewsDetail', params: { id: newsId } }); },
    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
    }
  }
};
</script>

<style scoped>
.nav-header { position: fixed; top: 0; left: 0; width: 100%; height: 65px; background: #005bbb; z-index: 999; }
.nav-container { width: 1200px; height: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.nav-menu { display: flex; gap: 30px; }
.nav-item { color: #fff; font-size: 16px; padding: 8px 14px; border-radius: 4px; cursor: pointer; text-decoration: none; }
.nav-item.active { background: #003377; font-weight: bold; }
.user-info { color: #fff; display: flex; gap: 20px; align-items: center; }
.nav-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; cursor: pointer; }
.welcome-text { font-size: 14px; }
.logout-btn { color: #fff !important; border: 1px solid #fff; padding: 4px 14px !important; margin-left: 5px; }

.student-home { background: #f5f7fa; min-height: 100vh; }
.main-container { width: 1200px; margin: 90px auto 40px; }
.banner-carousel { border-radius: 8px; overflow: hidden; margin-bottom: 30px; }
.swiper-img { width: 100%; height: 100%; object-fit: cover; }
.notice-section { background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
.section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #005bbb; padding-bottom: 10px; margin-bottom: 15px; }
.title-text { font-size: 20px; color: #005bbb; font-weight: bold; }
.notice-item { display: flex; justify-content: space-between; padding: 15px 10px; border-bottom: 1px dashed #eee; cursor: pointer; }
.notice-item:hover { background: #f9fbff; color: #005bbb; }
.notice-main { display: flex; align-items: center; gap: 10px; flex: 1; overflow: hidden; }
.notice-title { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>