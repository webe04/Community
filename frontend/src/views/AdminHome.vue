<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title"><i class="el-icon-monitor"></i> 管理员控制台</h2>
        <p class="page-desc">欢迎使用社区管理系统，请选择操作模块</p>
      </div>
      <div class="header-right">
        <el-popconfirm title="确定退出系统并返回登录页吗？" @confirm="logout">
          <template #reference>
            <el-button type="danger" size="small" icon="el-icon-switch-button" plain>退出登录</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <el-row :gutter="30" class="menu-grid">
      <el-col :span="6">
        <el-card shadow="hover" class="nav-card" @click.native="$router.push('/admin/banner')">
          <div class="card-body">
            <i class="el-icon-picture-outline" style="color: #409eff;"></i>
            <h3>轮播图管理</h3>
            <p>更新学生端首页滚动展示的图片资源</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="nav-card" @click.native="$router.push('/admin/news')">
          <div class="card-body">
            <i class="el-icon-news" style="color: #67c23a;"></i>
            <h3>新闻公告管理</h3>
            <p>发布校园快讯及活动通知</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="nav-card" @click.native="$router.push('/admin/activity')">
          <div class="card-body">
            <i class="el-icon-date" style="color: #e6a23c;"></i>
            <h3>活动审核管理</h3>
            <p>审核各社团提交的活动申请</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="nav-card" @click.native="$router.push('/admin/club-audit')">
          <div class="card-body">
            <i class="el-icon-office-building" style="color: #f56c6c;"></i>
            <h3>社团建社审核</h3>
            <p>处理新社团的入驻与创建申请</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("loginUser");
      this.$router.push('/login');
      this.$message.success("已成功退出登录");
    }
  }
}
</script>

<style scoped>
.admin-container { padding: 40px; background-color: #f5f7fa; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
.page-title { font-size: 28px; color: #303133; margin-bottom: 10px; }
.page-desc { color: #909399; font-size: 14px; }
.nav-card { cursor: pointer; text-align: center; transition: all 0.3s; border-radius: 12px; height: 260px; }
.nav-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.card-body { padding: 30px 10px; }
.card-body i { font-size: 50px; margin-bottom: 20px; }
.card-body h3 { font-size: 18px; margin-bottom: 10px; color: #303133; }
.card-body p { font-size: 13px; color: #909399; line-height: 1.6; }
</style>