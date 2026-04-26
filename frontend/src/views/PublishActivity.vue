<template>
  <div class="leader-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/leader/home')">首页</a>
          <a class="nav-item" @click="$router.push('/leader/info')">社团管理</a>
          <a class="nav-item" @click="$router.push('/leader/member')">成员审核</a>
          <a class="nav-item" @click="$router.push('/leader/activity/manage')">活动管理</a>
          <a class="nav-item active" @click="$router.push('/leader/activity/publish')">活动发布</a>
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
      <el-breadcrumb separator="/" style="margin-bottom: 25px;">
        <el-breadcrumb-item :to="{ path: '/leader/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动发布</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <div slot="header"><b>📝 发布新活动</b></div>
        <el-form :model="activityForm" ref="activityForm" label-width="120px">
          <el-form-item label="活动封面">
            <el-upload class="cover-uploader" action="/api/upload/img" :show-file-list="false" :on-success="res => { if(res.code===200) activityForm.cover=res.data }">
              <img v-if="activityForm.cover" :src="getImgUrl(activityForm.cover)" class="cover-preview">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="活动名称"><el-input v-model="activityForm.activityName"></el-input></el-form-item>
          <el-form-item label="活动地点"><el-input v-model="activityForm.location"></el-input></el-form-item>
          <el-form-item label="活动详情"><el-input type="textarea" v-model="activityForm.detail" :rows="5"></el-input></el-form-item>
          <el-form-item><el-button type="primary" @click="publish" :loading="submitting">立即发布</el-button></el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { userInfo: {}, submitting: false, activityForm: { clubId: null, cover: "", activityName: "", location: "", detail: "" } }; },
  created() {
    const user = JSON.parse(localStorage.getItem("loginUser") || "{}");
    this.userInfo = user; this.activityForm.clubId = user.clubId;
  },
  methods: {
    publish() {
      this.submitting = true;
      this.$axios.post("/api/activity/add", this.activityForm).then(res => {
        if (res.data.code === 200) { this.$message.success("发布成功"); this.$router.push('/leader/home'); }
      }).finally(() => { this.submitting = false; });
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
.cover-uploader { border: 1px dashed #d9d9d9; width: 320px; height: 180px; display: flex; justify-content: center; align-items: center; background: #fff; }
.cover-preview { width: 100%; height: 100%; object-fit: cover; }
</style>