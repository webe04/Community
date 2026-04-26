<template>
  <div class="leader-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/leader/home')">首页</a>
          <a class="nav-item" @click="$router.push('/leader/info')">社团管理</a>
          <a class="nav-item active" @click="$router.push('/leader/member')">成员审核</a>
          <a class="nav-item" @click="$router.push('/leader/activity/manage')">活动管理</a>
          <a class="nav-item" @click="$router.push('/leader/activity/publish')">活动发布</a>
          <a class="nav-item" @click="$router.push('/leader/member/recommend')">潜在成员</a>
          <a class="nav-item" @click="$router.push('/leader/apply')">申请社团</a>
        </nav>
        <div class="user-info">
          <div class="avatar-wrapper">
            <img :src="getImgUrl(userInfo.avatar)" class="nav-avatar" />
          </div>
          <span class="user-name">{{ userInfo.name }} | 审核中心</span>
          <el-button type="text" @click="logout" class="logout-btn">退出登录</el-button>
        </div>
      </div>
    </header>

    <div class="main-content">
      <el-breadcrumb separator="/" style="margin-bottom: 25px;">
        <el-breadcrumb-item :to="{ path: '/leader/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>审核管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card class="manage-card">
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane label="社团入团申请" name="club">
            <div class="tab-header"><span class="tab-title">📌 待处理入团申请</span></div>
            <el-table :data="pagedApplyList" v-loading="loadingClub" stripe>
              <el-table-column label="申请人" width="220">
                <template slot-scope="scope">
                  <div class="student-profile">
                    <el-avatar :size="35" :src="getImgUrl(scope.row.avatar)"></el-avatar>
                    <div class="text-info">
                      <div class="name">{{ scope.row.studentName }}</div>
                      <div class="number">{{ scope.row.studentNumber }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="clubName" label="申请社团" />
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="success" size="mini" @click="handleAudit(scope.row.id, 1)">通过</el-button>
                  <el-button type="danger" size="mini" @click="handleAudit(scope.row.id, 2)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-center">
              <el-pagination background layout="prev, pager, next" :current-page.sync="clubPage" :page-size="pageSize" :total="applyList.length"></el-pagination>
            </div>
          </el-tab-pane>

          <el-tab-pane label="活动报名申请" name="activity">
            <div class="tab-header"><span class="tab-title">🎉 待处理活动报名</span></div>
            <el-table :data="pagedActivityApplyList" v-loading="loadingActivity" stripe>
              <el-table-column label="申请人" width="220">
                <template slot-scope="scope">
                  <div class="student-profile">
                    <el-avatar :size="35" :src="getImgUrl(scope.row.avatar)"></el-avatar>
                    <div class="text-info">
                      <div class="name">{{ scope.row.studentName }}</div>
                      <div class="number">{{ scope.row.studentNumber }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="activityName" label="报名活动" show-overflow-tooltip />
              <el-table-column prop="clubName" label="所属社团" width="150" />
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleActivityAudit(scope.row.id, 1)">批准</el-button>
                  <el-button type="warning" size="mini" @click="handleActivityAudit(scope.row.id, 2)">驳回</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-center">
              <el-pagination background layout="prev, pager, next" :current-page.sync="actPage" :page-size="pageSize" :total="activityApplyList.length"></el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}, activeTab: 'club', applyList: [], activityApplyList: [],
      loadingClub: false, loadingActivity: false, clubPage: 1, actPage: 1, pageSize: 10
    };
  },
  computed: {
    pagedApplyList() { return this.applyList.slice((this.clubPage - 1) * this.pageSize, this.clubPage * this.pageSize); },
    pagedActivityApplyList() { return this.activityApplyList.slice((this.actPage - 1) * this.pageSize, this.actPage * this.pageSize); }
  },
  created() {
    const user = localStorage.getItem("loginUser");
    if (user) { this.userInfo = JSON.parse(user); this.fetchApplyList(); this.fetchActivityApplyList(); }
  },
  methods: {
    fetchApplyList() {
      this.loadingClub = true;
      this.$axios.get("/api/member/apply-list", { params: { leaderId: this.userInfo.id } }).then(res => {
        if (res.data.code === 200) this.applyList = res.data.data || [];
      }).finally(() => { this.loadingClub = false; });
    },
    fetchActivityApplyList() {
      this.loadingActivity = true;
      this.$axios.get("/api/member/activity-apply-list", { params: { leaderId: this.userInfo.id } }).then(res => {
        if (res.data.code === 200) this.activityApplyList = res.data.data || [];
      }).finally(() => { this.loadingActivity = false; });
    },
    handleAudit(id, status) {
      this.$axios.post('/api/member/audit', { id: id, status: status }).then(res => {
        if (res.data.code === 200) { this.$message.success("处理成功"); this.fetchApplyList(); }
      });
    },
    handleActivityAudit(id, status) {
      this.$axios.post('/api/member/activity-audit', { id: id, status: status }).then(res => {
        if (res.data.code === 200) { this.$message.success("处理成功"); this.fetchActivityApplyList(); }
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
.tab-header { padding: 10px 0 15px; }
.tab-title { font-size: 16px; font-weight: bold; color: #005bbb; }
.student-profile { display: flex; align-items: center; gap: 10px; }
.text-info .name { font-weight: bold; font-size: 14px; color: #333; }
.text-info .number { font-size: 12px; color: #999; }
.pagination-center { display: flex; justify-content: center; margin-top: 20px; }
</style>