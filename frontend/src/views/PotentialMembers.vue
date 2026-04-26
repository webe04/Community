<template>
  <div class="leader-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/leader/home')">首页</a>
          <a class="nav-item" @click="$router.push('/leader/info')">社团管理</a>
          <a class="nav-item" @click="$router.push('/leader/member')">成员审核</a>
          <a class="nav-item" @click="$router.push('/leader/activity/manage')">活动管理</a>
          <a class="nav-item" @click="$router.push('/leader/activity/publish')">活动发布</a>
          <a class="nav-item active">潜在成员</a>
          <a class="nav-item" @click="$router.push('/leader/apply')">申请社团</a>
        </nav>
        <div class="user-info">
          <div class="avatar-wrapper">
            <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" @error="setDefaultAvatar" />
          </div>
          <span class="user-name">欢迎,{{ userInfo.name || '负责人' }}</span>
          <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </div>
    </header>
    <div class="main-content">
      <el-breadcrumb separator="/" style="margin-bottom: 25px;">
        <el-breadcrumb-item :to="{ path: '/leader/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>潜在成员推荐</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card shadow="never" class="manage-card">
        <div slot="header" class="header-box">
          <span class="title">潜在成员 | 智能匹配</span>
          <el-select v-model="currentClubId" placeholder="切换负责社团" size="small" @change="fetchPotential" style="width: 200px;">
            <el-option v-for="item in myClubs" :key="item.id" :label="item.clubName" :value="item.id" />
          </el-select>
        </div>
        <el-table :data="recommendList" v-loading="loading" stripe>
          <el-table-column label="潜在成员" min-width="250">
            <template slot-scope="scope">
              <div class="student-info">
                <el-avatar 
                  :size="45" 
                  :src="getImgUrl(scope.row.student.avatar)" 
                  @error="setDefaultAvatar"
                  class="avatar-fix"
                ></el-avatar>
                <div class="name-box">
                  <div class="stu-name">{{ scope.row.student.name }}</div>
                  <div class="stu-tags">
                    <el-tag v-for="(tag, i) in formatTags(scope.row.student.tags)" :key="i" size="mini" effect="plain">{{ tag }}</el-tag>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column label="匹配指数" width="180" align="center">
            <template slot-scope="scope">
              <div class="score-display">
                <span class="score-val">{{ (scope.row.score * 100).toFixed(0) }}%</span>
                <el-progress :percentage="Number((scope.row.score * 100).toFixed(0))" :show-text="false" status="exception"></el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" round icon="el-icon-message" @click="sendInvite(scope.row.student)">发函邀请</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      myClubs: [],
      recommendList: [],
      currentClubId: null,
      loading: false
    };
  },
  created() {
    const user = localStorage.getItem("loginUser");
    this.userInfo = user ? JSON.parse(user) : {};
    this.loadClubs();
  },
  methods: {
    loadClubs() {
      this.$axios.get("/api/leader/club/list", { params: { leaderId: this.userInfo.id } }).then(res => {
        this.myClubs = res.data.data || [];
        if (this.myClubs.length > 0) {
          this.currentClubId = this.myClubs[0].id;
          this.fetchPotential();
        }
      });
    },
    fetchPotential() {
      if (!this.currentClubId) return;
      this.loading = true;
      this.$axios.get("/api/recommend/members", { 
        params: { clubId: this.currentClubId, topN: 10 } 
      }).then(res => {
        if (res.data.code === 200) {
          this.recommendList = res.data.data || [];
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    sendInvite(student) {
      this.$axios.post("/api/leader/member/invite", {
        clubId: this.currentClubId,
        studentId: student.id
      }).then(res => {
        if (res.data.code === 200 || res.data.code === '200') {
          this.$message.success(`邀请函已发送至 ${student.name}`);
          this.fetchPotential();
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    formatTags(tags) {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      if (typeof tags === 'string') {
        return tags.replace(/[[\]"]/g, '').split(',').map(t => t.trim()).filter(t => t !== '');
      }
      return [];
    },
    getImgUrl(path) {
      const baseUrl = 'http://localhost:9090';
      if (!path) return baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
      let realPath = typeof path === 'object' ? (path.logo || path.url) : path;
      realPath = realPath.replace('/api', '');
      return realPath.startsWith('http') ? realPath : baseUrl + (realPath.startsWith('/') ? '' : '/') + realPath;
    },
    setDefaultAvatar(e) { 
      e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; 
    },
    logout() { 
      localStorage.removeItem("loginUser"); 
      this.$router.push("/login"); 
    }
  }
};
</script>

<style scoped>
.leader-page { width: 100%; min-height: 100vh; background: #f5f7fa; }
.nav-header { position: fixed; top: 0; left: 0; width: 100%; height: 65px; background: #005bbb; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.nav-container { width: 1200px; height: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; box-sizing: border-box; }
.nav-menu { display: flex; gap: 10px; }
.nav-item { color: #fff; font-size: 15px; padding: 8px 15px; border-radius: 4px; cursor: pointer; text-decoration: none; }
.nav-item.active { background: #003377; font-weight: bold; }
.user-info { display: flex; align-items: center; gap: 12px; color: #fff; }
.avatar-wrapper { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; border: 2px solid #fff; }
.nav-avatar { width: 100%; height: 100%; object-fit: cover; }
.main-content { width: 1200px; margin: 90px auto 50px; padding: 0 20px; box-sizing: border-box; }
.header-box { display: flex; justify-content: space-between; align-items: center; }
.title { font-weight: bold; font-size: 18px; color: #409EFF; }

.student-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 5px 0;
}
.name-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}
.stu-name {
  font-weight: bold;
  font-size: 15px;
  color: #333;
}
.stu-tags {
  display: flex;
  gap: 5px;
}
.score-display {
  width: 100px;
  margin: 0 auto;
}
.score-val {
  font-family: 'Arial';
  font-weight: bold;
  color: #f56c6c;
  font-size: 16px;
  display: block;
  margin-bottom: 3px;
}

.avatar-fix >>> img {
  object-fit: cover !important;
  object-position: center !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}
</style>