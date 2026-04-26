<template>
  <div class="profile-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/student/home')">首页</a>
          <a class="nav-item" @click="$router.push('/student/club')">社团浏览</a>
          <a class="nav-item" @click="$router.push('/student/activity')">活动中心</a>
          <a class="nav-item" @click="$router.push('/student/my-join')">我的社团</a>
          <a class="nav-item active">个人信息</a>
        </nav>
        <div class="user-info">
          <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" @error="setDefaultAvatar" />
          <span class="welcome-text">欢迎，{{ userInfo.name || '同学' }}</span>
          <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </div>
    </header>

    <div class="main-container">
      <div class="profile-card">
        <h2 class="title">👤 个人信息管理</h2>
        <div class="avatar-box">
          <el-upload action="/api/upload/img" :show-file-list="false" :on-success="handleAvatarSuccess" class="avatar-upload">
            <img :src="getImgUrl(form.avatar)" class="avatar" @error="setDefaultAvatar" />
            <div class="tip">点击修改头像</div>
          </el-upload>
        </div>
        <el-form :model="form" label-width="100px" class="profile-form">
          <el-form-item label="学号"><el-input v-model="form.username" disabled /></el-form-item>
          <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
          <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
          <el-form-item label="身份"><el-input value="学生" disabled /></el-form-item>
          <el-form-item><el-button type="primary" @click="saveInfo">保存修改</el-button></el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { userInfo: {}, form: {} }; },
  created() {
    const user = localStorage.getItem("loginUser");
    if (!user) { this.$router.push("/login"); return; }
    this.userInfo = JSON.parse(user);
    this.form = { ...this.userInfo };
  },
  methods: {
    getImgUrl(path) {
      const baseUrl = 'http://localhost:9090';
      if (!path) return baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
      let realPath = typeof path === 'object' ? (path.imgUrl || path.url || path.avatar) : path;
      realPath = realPath.replace('/api', '');
      return realPath.startsWith('http') ? realPath : baseUrl + (realPath.startsWith('/') ? '' : '/') + realPath;
    },
    setDefaultAvatar(e) { e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; },
    handleAvatarSuccess(res) {
      this.form.avatar = res.data;
      this.userInfo.avatar = res.data; 
      localStorage.setItem("loginUser", JSON.stringify(this.form));
      this.$message.success("头像上传成功");
    },
    saveInfo() {
      this.$axios.post("/api/student/update", this.form).then(() => {
        localStorage.setItem("loginUser", JSON.stringify(this.form));
        this.userInfo = { ...this.form }; 
        this.$message.success("保存成功");
      });
    },
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

.profile-page { background: #f5f7fa; min-height: 100vh; }
.main-container { width: 1200px; margin: 90px auto 50px; display: flex; justify-content: center; }
.profile-card { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 2px 20px rgba(0,0,0,0.08); width: 600px; text-align: center; }
.avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid #eee; }
</style>