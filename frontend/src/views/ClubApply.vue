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
            <a class="nav-item" @click="$router.push('/leader/member/recommend')">潜在成员</a>
            <a class="nav-item active" @click="$router.push('/leader/apply')">申请社团</a>
          </nav>
          <div class="user-info">
            <div class="avatar-wrapper">
              <img v-if="userInfo && userInfo.avatar" :src="getImgUrl(userInfo.avatar)" class="nav-avatar" />
              <img v-else src="http://localhost:9090/uploads/2026/03/25/default-avatar.jpg" class="nav-avatar" />
            </div>
            <span class="user-name">{{ userInfo ? userInfo.name : '加载中...' }}</span>
            <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
          </div>
        </div>
      </header>
  
      <div class="main-content">
        <el-breadcrumb separator="/" style="margin-bottom: 25px;">
          <el-breadcrumb-item :to="{ path: '/leader/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>申请创建新社团</el-breadcrumb-item>
        </el-breadcrumb>
  
        <el-card shadow="hover" class="apply-card">
          <div slot="header"><b>✨ 填写社团申请信息</b></div>
          
          <el-form :model="clubForm" :rules="rules" ref="clubFormRef" label-width="100px">
            <el-form-item label="社团名称" prop="clubName">
              <el-input v-model="clubForm.clubName" placeholder="请输入社团名称"></el-input>
            </el-form-item>
            
            <el-form-item label="社团类别" prop="category">
              <el-select v-model="clubForm.category" placeholder="请选择社团类别" style="width: 100%;">
                <el-option label="学术类社团" value="学术类社团"></el-option>
                <el-option label="体育类社团" value="体育类社团"></el-option>
                <el-option label="艺术类组织&社团" value="艺术类组织&社团"></el-option>
                <el-option label="公益类社团" value="公益类社团"></el-option>
                <el-option label="逸趣类社团" value="逸趣类社团"></el-option>
                <el-option label="功能性组织" value="功能性组织"></el-option>
              </el-select>
            </el-form-item>
    
            <el-form-item label="社团标签" prop="tags">
              <el-input v-model="clubForm.tags" placeholder="例如：编程,科技 (请用英文逗号分隔)"></el-input>
            </el-form-item>
    
            <el-form-item label="社团简介" prop="intro">
              <el-input type="textarea" :rows="4" v-model="clubForm.intro" placeholder="介绍一下你的社团..."></el-input>
            </el-form-item>
    
            <el-form-item label="社团Logo" prop="logo">
               <el-upload
                  class="avatar-uploader"
                  action="/api/upload/img" 
                  :show-file-list="false"
                  :on-success="handleLogoSuccess">
                  <img v-if="clubForm.logo" :src="getImgUrl(clubForm.logo)" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
            </el-form-item>
    
            <el-form-item>
              <el-button type="primary" @click="submitApply('clubFormRef')">提交申请</el-button>
              <el-button @click="resetForm('clubFormRef')">重置表单</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </template>
    
  <script>
  export default {
    name: 'ClubApply',
    data() {
      return {
        userInfo: null,
        clubForm: { clubName: '', category: '', tags: '', intro: '', logo: '', leaderId: null },
        rules: {
          clubName: [{ required: true, message: '请输入社团名称', trigger: 'blur' }],
          category: [{ required: true, message: '请选择社团类别', trigger: 'change' }],
          tags: [{ required: true, message: '请输入社团标签', trigger: 'blur' }],
          intro: [{ required: true, message: '请输入社团简介', trigger: 'blur' }]
        }
      };
    },
    created() {
      const userStr = localStorage.getItem("loginUser");
      if (userStr) {
        this.userInfo = JSON.parse(userStr);
        this.clubForm.leaderId = this.userInfo.id;
      } else {
        this.$router.push("/login");
      }
    },
    methods: {
      handleLogoSuccess(res) {
        if (res.code == 200) { 
          this.clubForm.logo = res.data;
          this.$message.success("Logo上传成功");
        } else {
          this.$message.error(res.msg || "Logo上传失败");
        }
      },
      submitApply(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/api/club/apply', this.clubForm).then(res => {
              if(res.data.code == 200) {
                this.$message.success("申请提交成功，请等待审核");
                this.$router.push('/leader/home'); 
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.clubForm.logo = '';
      },
      getImgUrl(path) {
        if (!path || typeof path !== 'string') {
          return 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg';
        }
        if (path.startsWith('http')) return path;
        return `http://localhost:9090${path.replace('/api', '')}`;
      },
      logout() {
        localStorage.removeItem("loginUser");
        this.$router.push("/login");
      }
    }
  }
  </script>
    
  <style scoped>
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
  .avatar-uploader { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; background: #fff; transition: 0.3s; }
  .avatar-uploader:hover { border-color: #409EFF; }
  .avatar-uploader-icon { font-size: 28px; color: #8c939d; }
  .avatar { width: 120px; height: 120px; display: block; object-fit: cover; border-radius: 6px; }
  .apply-card { max-width: 850px; margin: 0 auto; }
  </style>