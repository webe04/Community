<template>
    <div class="club-detail">
      <header class="nav-header">
        <div class="nav-container">
          <nav class="nav-menu">
            <a class="nav-item" @click="$router.push('/student/home')">首页</a>
            <a class="nav-item active">社团详情</a>
          </nav>
          <div class="user-info">
            <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" @error="setDefaultAvatar" />
            <span>{{ userInfo.name || '同学' }}</span>
            <el-button type="text" @click="$router.back()" style="color:#fff;margin-left:15px;">返回</el-button>
          </div>
        </div>
      </header>
  
      <div class="main-container" v-loading="loading">
        <el-card class="detail-card" v-if="club && club.clubName">
          <div class="club-header">
            <div class="logo-box" v-if="club.logo !== undefined">
                <img 
                    :src="getImgUrl(club.logo)" 
                    class="detail-logo" 
                    @error="setDefaultAvatar" 
                />
                </div>
            <div class="base-info">
              <h1 class="club-title">{{ club.clubName }}</h1>
              <div class="tag-row">
                <el-tag type="warning" effect="dark">{{ club.category }}</el-tag>
                <el-tag v-for="tag in formatTags(club.tags)" :key="tag" style="margin-left:8px;">{{ tag }}</el-tag>
              </div>
              <div class="action-row" style="margin-top:25px;">
                <el-button v-if="applyStatus === -1" type="primary" size="large" @click="applyDialogVisible = true">申请加入</el-button>
                <el-button v-else-if="applyStatus === 0" type="info" size="large" disabled>审核中...</el-button>
                <el-button v-else-if="applyStatus === 1" type="success" size="large" disabled>已加入</el-button>
              </div>
            </div>
          </div>
          <el-divider>社团简介</el-divider>
          <div class="club-intro">{{ club.intro || '暂无详细介绍' }}</div>
        </el-card>
  
        <el-empty v-else-if="!loading" description="暂无该社团详情信息"></el-empty>
      </div>
  
      <el-dialog title="入团申请" :visible.sync="applyDialogVisible" width="400px">
        <el-input type="textarea" v-model="reason" placeholder="简单介绍下自己，增加通过率..." rows="4"></el-input>
        <div slot="footer">
          <el-button @click="applyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitApply">提交申请</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        clubId: null,
        club: {},
        userInfo: {},
        applyStatus: -1,
        loading: false,
        applyDialogVisible: false,
        reason: ''
      };
    },
    watch: {
      '$route.params.id': {
        immediate: true,
        handler(newId) {
          if (newId && newId !== 'undefined') {
            this.clubId = newId;
            this.initPage();
          }
        }
      }
    },
    created() {
      const user = localStorage.getItem("loginUser");
      this.userInfo = user ? JSON.parse(user) : {};
    },
    methods: {
      initPage() {
        this.fetchData();
        this.checkStatus();
      },
      fetchData() {
        this.loading = true;
        this.$axios.get(`/api/club/detail/${this.clubId}`)
          .then(res => {
            this.club = res.data.data || {};
            this.loading = false;
          })
          .catch(() => { this.loading = false; });
      },
      checkStatus() {
        if (!this.userInfo.id) return;
        this.$axios.get('/api/member/checkStatus', {
          params: { clubId: this.clubId, studentId: this.userInfo.id }
        }).then(res => { 
          this.applyStatus = res.data.data; 
        });
      },
      submitApply() {
        if (!this.reason.trim()) return this.$message.warning("请输入申请理由");
        this.$axios.post('/api/member/apply', {
          clubId: this.clubId,
          studentId: this.userInfo.id,
          reason: this.reason
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success("申请已提交");
            this.applyDialogVisible = false;
            this.checkStatus();
          }
        });
      },
      getImgUrl(path) {
        const baseUrl = 'http://localhost:9090';
        if (!path || path === 'null' || path === 'undefined') {
            return "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png";
        }
        // 清洗路径
        let realPath = path.replace('/api', '');
        if (!realPath.startsWith('/')) realPath = '/' + realPath;
        return baseUrl + realPath;
    },
      setDefaultAvatar(e) { 
        e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; 
      },
      formatTags(s) { return s ? s.split(',') : []; }
    }
  };
  </script>
  
  <style scoped>
  .club-detail { background: #f5f7fa; min-height: 100vh; padding-bottom: 40px; }
  .nav-header { position: fixed; top: 0; left: 0; width: 100%; height: 65px; background: #005bbb; z-index: 999; }
  .nav-container { width: 1000px; height: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  .nav-menu { display: flex; gap: 30px; }
  .nav-item { color: #fff; font-size: 16px; cursor: pointer; text-decoration: none; padding: 5px 10px; }
  .nav-item.active { font-weight: bold; border-bottom: 2px solid #fff; }
  .user-info { color: #fff; display: flex; align-items: center; gap: 10px; }
  .nav-avatar { width: 35px; height: 35px; border-radius: 50%; border: 2px solid #fff; object-fit: cover; }
  
  .main-container { width: 1000px; margin: 90px auto 0; min-height: 400px; }
  .detail-card { border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .club-header { display: flex; gap: 40px; align-items: center; }
  .logo-box { width: 180px; height: 180px; border-radius: 8px; border: 1px solid #eee; overflow: hidden; background: #fff; }
  .detail-logo { width: 100%; height: 100%; object-fit: contain; }
  .club-title { font-size: 26px; color: #333; margin: 0 0 15px 0; }
  .club-intro { line-height: 1.8; color: #555; white-space: pre-line; font-size: 15px; }
  </style>