<template>
  <div class="leader-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/leader/home')">首页</a>
          <a class="nav-item active" @click="$router.push('/leader/info')">社团管理</a>
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
      <el-breadcrumb separator="/" style="margin-bottom: 25px;">
        <el-breadcrumb-item :to="{ path: '/leader/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>社团管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <div slot="header"><b>🏮 我管理的社团</b></div>
        <el-table :data="pagedClubList" border stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column label="Logo" width="100">
            <template slot-scope="scope">
              <el-image :src="getImgUrl(scope.row.logo)" fit="cover" class="table-logo"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="clubName" label="社团名称" />
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">{{ scope.row.status === 1 ? '已通过' : '待审核' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改资料</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="clubList.length">
          </el-pagination>
        </div>
      </el-card>

      <el-dialog title="编辑社团资料" :visible.sync="dialogVisible" width="500px">
        <el-form :model="editForm" label-width="100px">
          <el-form-item label="社团 Logo">
            <el-upload class="logo-uploader" action="/api/upload/img" :show-file-list="false" :on-success="res => { if(res.code===200) editForm.logo=res.data }">
              <img v-if="editForm.logo" :src="getImgUrl(editForm.logo)" class="preview-img">
              <i v-else class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="社团介绍"><el-input type="textarea" v-model="editForm.intro" :rows="5"></el-input></el-form-item>
        </el-form>
        <div slot="footer"><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitUpdate">提交</el-button></div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { userInfo: {}, clubList: [], dialogVisible: false, editForm: {}, currentPage: 1, pageSize: 5 }; },
  computed: {
    pagedClubList() {
      return this.clubList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  created() {
    const user = localStorage.getItem("loginUser");
    if (user) { this.userInfo = JSON.parse(user); this.fetchClubs(); }
  },
  methods: {
    fetchClubs() {
      this.$axios.get("/api/club/listByLeader", { params: { leaderId: this.userInfo.id } }).then(res => {
        if (res.data.code === 200) this.clubList = res.data.data || [];
      });
    },
    handleEdit(row) { this.editForm = { ...row }; this.dialogVisible = true; },
    submitUpdate() {
      this.$axios.post("/api/club/update", this.editForm).then(res => {
        if (res.data.code === 200) { this.$message.success("更新成功"); this.dialogVisible = false; this.fetchClubs(); }
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
.table-logo { width: 50px; height: 50px; border-radius: 4px; }
.logo-uploader { border: 1px dashed #d9d9d9; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; background: #fff; }
.preview-img { width: 120px; height: 120px; object-fit: cover; }
.pagination-container { margin-top: 20px; display: flex; justify-content: center; }
</style>