<template>
  <div class="my-join-page">
    <header class="nav-header">
      <div class="nav-container">
        <nav class="nav-menu">
          <a class="nav-item" @click="$router.push('/student/home')">首页</a>
          <a class="nav-item" @click="$router.push('/student/club')">社团浏览</a>
          <a class="nav-item" @click="$router.push('/student/activity')">活动中心</a>
          <a class="nav-item active">我的社团</a>
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
      <el-breadcrumb separator="/" class="breadcrumb-nav">
        <el-breadcrumb-item :to="{ path: '/student/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的社团与邀请</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card shadow="never" class="content-card">
        <el-tabs v-model="activeTab" type="card">
          
          <el-tab-pane label="我的社团申请" name="club">
            <el-table :data="myClubs" v-loading="loading" stripe style="width: 100%">
              <el-table-column label="社团Logo" width="120" align="center">
                <template slot-scope="scope">
                  <el-image :src="getImgUrl(scope.row.logo)" class="table-img" fit="contain"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="clubName" label="社团名称" />
              <el-table-column label="审核状态">
                <template slot-scope="scope">
                  <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" plain @click="goClubDetail(scope.row.clubid)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane name="invite">
            <span slot="label">
              社团邀请 
              <el-badge v-if="myInvites.length > 0" :value="myInvites.length" class="item"></el-badge>
            </span>
            <el-table :data="myInvites" stripe style="width: 100%">
              <el-table-column label="邀请社团" prop="clubName" width="200" />
              <el-table-column label="社团简介" prop="intro" show-overflow-tooltip />
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button type="success" size="mini" @click="handleInvite(scope.row.id, 1)">接受加入</el-button>
                  <el-button type="danger" size="mini" plain @click="handleInvite(scope.row.id, 4)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-empty v-if="myInvites.length === 0" description="暂无社团邀请"></el-empty>
          </el-tab-pane>

          <el-tab-pane label="参加的活动" name="activity">
            <el-table :data="myActivities" stripe style="width: 100%">
              <el-table-column prop="activityName" label="活动名称" />
              <el-table-column prop="clubName" label="主办社团" width="150" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" @click="goActDetail(scope.row.activityId)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
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
      userInfo: {}, activeTab: 'club', loading: false,
      myClubs: [], myActivities: [], myInvites: [] // 存放邀请数据
    };
  },
  created() {
    const user = localStorage.getItem("loginUser");
    this.userInfo = JSON.parse(user);
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      const studentId = this.userInfo.id;
      const clubReq = this.$axios.get("/api/member/my-clubs", { params: { studentId } });
      const activityReq = this.$axios.get("/api/member/activity-apply-list-student", { params: { studentId } });
      const inviteReq = this.$axios.get("/api/member/my-invites", { params: { studentId } });

      Promise.all([clubReq, activityReq, inviteReq]).then(res => {
        this.myClubs = res[0].data.data;
        this.myActivities = res[1].data.data;
        this.myInvites = res[2].data.data || [];
      }).finally(() => { 
        this.loading = false; 
      });
    },

    handleInvite(id, action) {
      this.$axios.post("/api/member/handle-invite", { id, action }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.fetchData();
        }
      });
    },
    getStatusType(status) { 
        if (status === 0) return 'warning'; 
        if (status === 1) return 'success'; 
        return 'danger'; 
    },
    getStatusText(status) { 
        if (status === 0) return '审核中'; 
        if (status === 1) return '已加入'; 
        return '已驳回'; 
    },
    getImgUrl(path) {
      const baseUrl = 'http://localhost:9090';
      if (!path) return baseUrl + '/uploads/2026/03/25/default-avatar.jpg';
      let realPath = typeof path === 'object' ? (path.imgUrl || path.logo || path.cover) : path;
      realPath = realPath.replace('/api', '');
      return realPath.startsWith('http') ? realPath : baseUrl + (realPath.startsWith('/') ? '' : '/') + realPath;
    },
    setDefaultAvatar(e) { e.target.src = 'http://localhost:9090/uploads/2026/03/25/default-avatar.jpg'; },
    goClubDetail(id) { this.$router.push('/student/club/detail/' + id); },
    goActDetail(id) { this.$router.push('/student/activity/detail/' + id); },
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
.my-join-page { background: #f5f7fa; min-height: 100vh; }
.main-container { width: 1200px; margin: 90px auto 50px; }
.table-img { width: 80px; height: 50px; border-radius: 4px; }
</style>