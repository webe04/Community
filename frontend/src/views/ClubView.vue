<template>
  <div class="club-view">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/student/home')">首页</a>
          <a class="nav-item active">社团浏览</a>
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
      <div class="ai-recommend-box">
        <div class="section-title">
          <h3><i class="el-icon-data-analysis" style="color: #409EFF;"></i>智能推荐</h3>
          <span class="sub-title">懂你所爱</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(club, index) in recommendList" :key="'rec-'+index">
            <div class="rec-card" @click="goDetail(club.id)">
              <div class="rec-img-box">
                <img :src="getImgUrl(club.logo)" class="rec-img" />
                <div class="match-tag" v-if="club.score">
                  匹配度 {{ (club.score * 100).toFixed(0) }}%
                </div>
                <div class="match-tag" v-else>热门推荐</div>
              </div>
              <div class="rec-info">
                <h4>{{ club.clubName }}</h4>
                <p class="rec-desc">{{ club.category }}</p>
              </div>
            </div>
          </el-col>
          <el-empty v-if="recommendList.length === 0" description="正在努力计算中..." style="padding: 20px 0; width: 100%;"></el-empty>
        </el-row>
      </div>

      <el-divider style="margin: 40px 0;"></el-divider>

      <h3 class="guess-title" style="margin-bottom: 20px;">🏢 全部社团</h3>
      <el-row :gutter="30">
        <el-col :span="12" v-for="club in pagedClubList" :key="club.id">
          <div class="club-card">
            <div class="club-img-wrapper" @click="goDetail(club.id)">
              <img :src="getImgUrl(club.logo)" class="club-img" @error="setDefaultAvatar" />
              <div class="club-category">{{ club.category }}</div>
            </div>
            <div class="club-info-content">
              <h4 class="club-title" @click="goDetail(club.id)">{{ club.clubName }}</h4>
              <div class="tags-wrapper">
                <el-tag v-for="(tag, i) in formatTags(club.tags)" :key="i" size="mini" effect="plain" class="club-tag">{{ tag }}</el-tag>
              </div>
              <p class="club-intro-short">{{ club.intro || '该社团暂无简介...' }}</p>
              <el-button type="primary" size="small" round @click="goDetail(club.id)">查看详情</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="pagination-wrapper">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="clubList.length"
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
      clubList: [],
      recommendList: [],
      currentPage: 1,
      pageSize: 4 // 每页显示4个社团
    }; 
  },
  computed: {
    // 截取当前页要显示的社团列表
    pagedClubList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.clubList.slice(start, end);
    }
  },
  created() {
    const user = localStorage.getItem("loginUser");
    this.userInfo = user ? JSON.parse(user) : {};
    
    this.$axios.get("/api/home/club/list").then(res => { 
      this.clubList = res.data.data || []; 
    });
    
    if (this.userInfo && this.userInfo.id) {
      this.fetchRecommendations();
    }
  },
  methods: {
    handlePageChange(val) {
      this.currentPage = val;
      document.querySelector('.guess-title').scrollIntoView({ behavior: 'smooth' });
    },
    fetchRecommendations() {
      this.$axios.get("/api/recommend/clubs", { params: { studentId: this.userInfo.id } }).then(res => { 
        if(res.data.code === 200) {
          this.recommendList = res.data.data || [];
        }
      });
    },
    formatTags(tagStr) { 
      return tagStr ? tagStr.split(',').filter(t => t.trim() !== '') : []; 
    },
    getImgUrl(path) {
      const baseUrl = 'http://localhost:9090';
      if (!path) return baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
      let realPath = typeof path === 'object' ? (path.imgUrl || path.logo || path.url) : path;
      realPath = realPath.replace('/api', '');
      return realPath.startsWith('http') ? realPath : baseUrl + (realPath.startsWith('/') ? '' : '/') + realPath;
    },
    setDefaultAvatar(e) { e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; },
    goDetail(id) { this.$router.push("/student/club/detail/" + id); },
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

.club-view { background: #f5f7fa; min-height: 100vh; padding-bottom: 50px; }
.main-container { width: 1200px; margin: 90px auto 0; }

.ai-recommend-box { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); margin-bottom: 30px; }
.section-title { display: flex; align-items: baseline; gap: 15px; margin-bottom: 20px; border-bottom: 2px solid #f0f2f5; padding-bottom: 15px; }
.section-title h3 { margin: 0; font-size: 20px; color: #303133; }
.sub-title { font-size: 13px; color: #909399; }

.rec-card { border-radius: 8px; overflow: hidden; border: 1px solid #ebeef5; cursor: pointer; transition: all 0.3s; }
.rec-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); border-color: #c6e2ff; }
.rec-img-box { position: relative; width: 100%; height: 140px; background: #fafafa; }
.rec-img { width: 100%; height: 100%; object-fit: contain; padding: 10px; box-sizing: border-box; }
.match-tag { position: absolute; top: 10px; right: -5px; background: linear-gradient(90deg, #ff6b6b, #ff4757); color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 15px 0 0 15px; font-weight: bold; box-shadow: 0 2px 4px rgba(255, 71, 87, 0.3); }
.rec-info { padding: 12px 15px; text-align: center; }
.rec-info h4 { margin: 0 0 5px 0; font-size: 16px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rec-desc { margin: 0; font-size: 13px; color: #999; }

.club-card { background: #fff; border-radius: 16px; overflow: hidden; margin-bottom: 30px; display: flex; flex-direction: column; transition: 0.3s; border: 1px solid #eee; }
.club-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.club-img-wrapper { width: 100%; height: 220px; position: relative; overflow: hidden; cursor: pointer; }
.club-img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
.club-category { position: absolute; top: 15px; right: 15px; background: rgba(0, 91, 187, 0.8); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
.club-info-content { padding: 20px; text-align: center; }
.club-title { margin: 0 0 10px 0; font-size: 18px; color: #333; cursor: pointer; }
.tags-wrapper { margin-bottom: 10px; display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; }
.club-intro-short { height: 45px; overflow: hidden; color: #777; margin-bottom: 20px; font-size: 14px; }

.pagination-wrapper { margin-top: 40px; display: flex; justify-content: center; padding-bottom: 30px; }
</style>