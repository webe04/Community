<template>
    <div class="activity-detail-page">
      <header class="nav-header">
        <div class="nav-container">
          <nav class="nav-menu">
            <a class="nav-item" @click="$router.push('/student/home')">首页</a>
            <a class="nav-item" @click="$router.push('/student/club')">社团浏览</a>
            <a class="nav-item active" @click="$router.push('/student/activity')">活动中心</a>
            <a class="nav-item" @click="$router.push('/student/profile')">个人信息</a>
          </nav>
          <div class="user-info">
            <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" />
            <span class="welcome-text">欢迎，{{ userInfo.name || '同学' }}</span>
            <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
          </div>
        </div>
      </header>
  
      <div class="main-container">
        <div class="back-nav">
          <el-button icon="el-icon-back" type="text" @click="$router.back()">返回列表</el-button>
        </div>
  
        <el-card class="detail-card" v-loading="loading">
          <el-row :gutter="40" v-if="activity.id">
            <el-col :span="10">
              <img :src="getImgUrl(activity.cover)" class="detail-img" />
            </el-col>
  
            <el-col :span="14">
              <h1 class="detail-title">{{ activity.activityName }}</h1>
              
              <div class="info-list">
                <div class="info-item">
                  <i class="el-icon-time"></i>
                  <span>活动时间：{{ activity.startTime }} ~ {{ activity.endTime }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-location-outline"></i>
                  <span>活动地点：{{ activity.address || '校内指定地点' }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-user"></i>
                  <span>主办社团：{{ activity.clubName || '学校社团' }}</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-tickets"></i>
                  <div class="desc-content">
                    <p><strong>活动介绍：</strong></p>
                    <p class="desc-text">{{ activity.content || '暂无详细描述' }}</p>
                  </div>
                </div>
              </div>
  
              <div class="action-section">
                <el-button 
                  type="primary" 
                  size="large" 
                  :disabled="isApplied"
                  @click="handleApply"
                  class="apply-btn"
                >
                  {{ isApplied ? '已报名' : '立即报名参加' }}
                </el-button>
                <p class="tips" v-if="isApplied">
                  <i class="el-icon-success"></i> 您已成功报名该活动，请准时参加。
                </p>
              </div>
            </el-col>
          </el-row>
  
          <el-empty v-else-if="!loading" description="未找到相关活动信息"></el-empty>
        </el-card>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ActivityDetail',
    data() {
      return {
        id: this.$route.params.id,
        userInfo: {},
        activity: {},
        isApplied: false,
        loading: false
      };
    },
    created() {
      this.initData();
    },
    methods: {
      async initData() {
        //获取本地登录用户信息
        const user = localStorage.getItem("loginUser");
        this.userInfo = user ? JSON.parse(user) : {};
  
        this.loading = true;
        try {
          //获取活动详情
          const detailRes = await this.$axios.get(`/api/home/activity/detail/${this.id}`);
          if (detailRes.data.code === 200) {
            this.activity = detailRes.data.data;
          } else {
            this.$message.error(detailRes.data.msg || "获取详情失败");
          }
  
          //校验报名状态 (仅在用户已登录时校验)
          if (this.userInfo.id) {
            const statusRes = await this.$axios.get(`/api/home/activity/status/${this.id}/${this.userInfo.id}`);
            this.isApplied = !!statusRes.data.data; // 确保转为布尔值
          }
        } catch (error) {
          console.error("数据加载失败:", error);
          this.$message.error("服务器响应异常");
        } finally {
          this.loading = false;
        }
      },
  
      handleApply() {
        if (!this.userInfo.id) {
          this.$message.warning("请先登录后再报名");
          this.$router.push('/login');
          return;
        }
  
        this.$confirm('确定要报名参加这个活动吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$axios.post("/api/home/activity/apply", {
            activityId: this.id,
            studentId: this.userInfo.id
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success("报名成功！");
              this.isApplied = true;
            } else {
              this.$message.error(res.data.msg || "报名失败");
            }
          });
        }).catch(() => {});
      },
  
      getImgUrl(path) {
        const baseUrl = 'http://localhost:9090';
        const defaultImg = baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
        
        if (!path) return defaultImg;
        if (path.startsWith('http')) return path;
        let realPath = path.replace(/^\/?api/, ''); 
        if (!realPath.startsWith('/')) realPath = '/' + realPath;
        
        return baseUrl + realPath;
      },
  
      logout() { 
        localStorage.removeItem("loginUser"); 
        this.$router.push("/login"); 
      }
    }
  };
  </script>
  
  <style scoped>
  /* 导航栏样式 */
  .nav-header { position: fixed; top: 0; left: 0; width: 100%; height: 65px; background: #005bbb; z-index: 999; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .nav-container { width: 1200px; height: 100%; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  .nav-menu { display: flex; gap: 30px; }
  .nav-item { color: #fff; font-size: 16px; padding: 8px 14px; border-radius: 4px; cursor: pointer; text-decoration: none; transition: 0.3s; }
  .nav-item:hover { background: rgba(255,255,255,0.1); }
  .nav-item.active { background: #003377; font-weight: bold; }
  .user-info { color: #fff; display: flex; gap: 15px; align-items: center; }
  .nav-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.8); }
  .logout-btn { color: #fff !important; border: 1px solid #fff; padding: 4px 12px !important; margin-left: 10px; }
  
  /* 内容布局 */
  .activity-detail-page { background: #f5f7fa; min-height: 100vh; padding-top: 85px; padding-bottom: 50px; }
  .main-container { width: 1100px; margin: 0 auto; }
  .back-nav { margin-bottom: 20px; }
  .detail-card { padding: 40px; border-radius: 12px; border: none; }
  .detail-img { width: 100%; height: auto; border-radius: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
  .detail-title { font-size: 32px; color: #2c3e50; margin: 0 0 30px 0; font-weight: 600; }
  
  /* 信息条目 */
  .info-list { margin-bottom: 40px; }
  .info-item { margin-bottom: 22px; display: flex; align-items: flex-start; color: #5a5e66; font-size: 16px; }
  .info-item i { margin-right: 12px; color: #005bbb; font-size: 22px; }
  .desc-content { flex: 1; }
  .desc-text { line-height: 1.8; color: #606266; white-space: pre-wrap; margin-top: 8px; }
  
  /* 按钮区域 */
  .action-section { border-top: 1px solid #f0f2f5; padding-top: 35px; }
  .apply-btn { width: 260px; height: 55px; font-size: 18px; letter-spacing: 1px; }
  .tips { color: #67C23A; margin-top: 15px; font-size: 14px; display: flex; align-items: center; gap: 5px; }
  </style>