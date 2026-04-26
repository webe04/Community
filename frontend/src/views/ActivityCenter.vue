<template>
  <div class="activity-center">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/student/home')">首页</a>
          <a class="nav-item" @click="$router.push('/student/club')">社团浏览</a>
          <a class="nav-item active">活动中心</a>
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
      <h2 class="page-title">🎉 热门活动</h2>
      <el-row :gutter="20">
        <el-col :span="12" v-for="act in pagedActivityList" :key="act.id">
          <div class="act-card" @click="goDetail(act.id)">
            <img :src="getImgUrl(act.cover)" class="act-img" @error="setDefaultAvatar" />
            <p class="act-name">{{ act.activityName }}</p>
          </div>
        </el-col>
      </el-row>

      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="activityList.length"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { 
    return { 
      userInfo: {}, 
      activityList: [],
      currentPage: 1,
      pageSize: 6 // 每页显示6个活动
    }; 
  },
  computed: {
    pagedActivityList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.activityList.slice(start, end);
    }
  },
  created() {
    const user = localStorage.getItem("loginUser");
    this.userInfo = user ? JSON.parse(user) : {};
    this.$axios.get("/api/home/activity/list").then(res => { 
      this.activityList = res.data.data || []; 
    });
  },
  methods: {
    handlePageChange(val) {
      this.currentPage = val;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    getImgUrl(path) {
      const baseUrl = 'http://localhost:9090';
      if (!path) return baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
      let realPath = typeof path === 'object' ? (path.imgUrl || path.url || path.cover) : path;
      realPath = realPath.replace('/api', '');
      return realPath.startsWith('http') ? realPath : baseUrl + (realPath.startsWith('/') ? '' : '/') + realPath;
    },
    setDefaultAvatar(e) { e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; },
    goDetail(id) { this.$router.push("/student/activity/detail/" + id); },
    logout() { localStorage.removeItem("loginUser"); this.$router.push("/login"); }
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

.activity-center { background: #f5f7fa; min-height: 100vh; }
.main-container { width: 1200px; margin: 90px auto 50px; }
.act-card { background: #fff; border-radius: 8px; overflow: hidden; margin-bottom: 20px; text-align: center; cursor: pointer; transition: 0.3s; border: 1px solid #eee; }
.act-card:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.act-img { width: 100%; height: 200px; object-fit: cover; }
.act-name { font-size: 17px; padding: 12px; font-weight: bold; color: #333; }

.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
}
</style>