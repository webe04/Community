<template>
  <div class="leader-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item active" @click="$router.push('/leader/home')">首页</a>
          <a class="nav-item" @click="$router.push('/leader/info')">社团管理</a>
          <a class="nav-item" @click="$router.push('/leader/member')">成员审核</a>
          <a class="nav-item" @click="$router.push('/leader/activity/manage')">活动管理</a>
          <a class="nav-item" @click="$router.push('/leader/activity/publish')">活动发布</a>
          <a class="nav-item" @click="$router.push('/leader/member/recommend')">潜在成员</a>
          <a class="nav-item" @click="$router.push('/leader/apply')">申请社团</a>
        </nav>
        <div class="user-info">
          <div class="avatar-wrapper">
            <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" />
          </div>
          <span class="user-name">{{ userInfo.name }}</span>
          <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </div>
    </header>

    <div class="main-content">
      <div class="welcome-section">
        <h2 class="welcome-title">🎉 欢迎回来，{{ userInfo.name }}</h2>
        <p class="sub-tip">当前您负责管理 <b style="color: #005bbb;">{{ clubList.length }}</b> 个社团。</p>
      </div>

      <div class="info-grid">
        <el-card class="club-card" shadow="hover">
          <div slot="header"><span><i class="el-icon-office-building"></i> 管理概览</span></div>
          <div class="info-item"><span class="label">管理账号：</span><span>{{ userInfo.username }}</span></div>
          <div class="info-item">
            <span class="label">负责社团：</span>
            <div class="club-tags">
              <el-tag v-for="item in clubList" :key="item.id" size="small" type="primary" class="m-tag">{{ item.clubName }}</el-tag>
            </div>
          </div>
        </el-card>
        <div class="quick-actions">
          <div class="action-item" @click="$router.push('/leader/member')">
            <i class="el-icon-s-check" style="color: #67C23A;"></i><p>成员审批</p>
          </div>
          <div class="action-item" @click="$router.push('/leader/activity/publish')">
            <i class="el-icon-microphone" style="color: #E6A23C;"></i><p>发布活动</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { userInfo: {}, clubList: [] }; },
  created() {
    const user = localStorage.getItem("loginUser");
    if (user) { this.userInfo = JSON.parse(user); this.fetchMyClubs(); } else { this.$router.push("/login"); }
  },
  methods: {
    fetchMyClubs() {
      this.$axios.get("/api/club/listByLeader", { params: { leaderId: this.userInfo.id } }).then(res => {
        if (res.data.code === 200) this.clubList = res.data.data;
      });
    },
    getImgUrl(path) {
      if (!path) return 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg';
      return `http://localhost:9090${path.replace('/api', '')}`;
    },
    logout() { localStorage.removeItem("loginUser"); this.$router.push("/login"); }
  }
};
</script>

<style scoped>
/* 核心统一布局 */
.leader-page { width: 100%; min-height: 100vh; background: #f5f7fa; }
.nav-header { position: fixed; top: 0; left: 0; width: 100%; height: 65px; background: #005bbb; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.nav-container { width: 1200px; height: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; box-sizing: border-box; }
.nav-menu { display: flex; gap: 10px; }
.nav-item { color: #fff; font-size: 15px; padding: 8px 15px; border-radius: 4px; cursor: pointer; text-decoration: none; opacity: 0.85; }
.nav-item.active { background: #003377; opacity: 1; font-weight: bold; }
.user-info { display: flex; align-items: center; gap: 12px; color: #fff; }
.avatar-wrapper { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; border: 2px solid #fff; flex-shrink: 0; }
.nav-avatar { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-size: 14px; white-space: nowrap; }
.logout-btn { color: #fff !important; margin-left: 5px; }
.main-content { width: 1200px; margin: 90px auto 50px; padding: 0 20px; box-sizing: border-box; }

/* 页面特有 */
.info-grid { display: flex; gap: 20px; margin-top: 20px; }
.club-card { flex: 2; }
.quick-actions { flex: 1; display: flex; flex-direction: column; gap: 15px; }
.action-item { background: #fff; padding: 20px; border-radius: 8px; text-align: center; cursor: pointer; transition: 0.3s; }
.action-item:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.info-item { margin-bottom: 15px; display: flex; }
.label { width: 80px; color: #999; }
</style>