<template>
    <div class="leader-page">
      <header class="nav-header">
        <div class="nav-container">
          <nav class="nav-menu">
            <a class="nav-item" @click="$router.push('/leader/home')">首页</a>
            <a class="nav-item" @click="$router.push('/leader/info')">社团管理</a>
            <a class="nav-item" @click="$router.push('/leader/member')">成员审核</a>
            <a class="nav-item active">活动管理</a>
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
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>
  
        <el-card>
          <div slot="header" class="card-header">
            <b>📅 活动管理列表</b>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="$router.push('/leader/activity/publish')">发布新活动</el-button>
          </div>
  
          <el-table :data="pagedActivityList" border stripe v-loading="loading">
            <el-table-column prop="id" label="ID" width="70" align="center" />
            <el-table-column label="封面" width="120" align="center">
              <template slot-scope="scope">
                <el-image :src="getImgUrl(scope.row.cover)" fit="cover" class="table-cover" :preview-src-list="[getImgUrl(scope.row.cover)]"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="activityName" label="活动名称" show-overflow-tooltip />
            <el-table-column prop="location" label="地点" width="150" show-overflow-tooltip />
            <el-table-column prop="maxPeople" label="限制人数" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.maxPeople || '不限' }}</template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
                <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row.id)" style="margin-left: 10px;">
                  <template #reference><el-button size="mini" type="danger" icon="el-icon-delete" circle></el-button></template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
  
          <div class="pagination-container">
            <el-pagination background layout="total, prev, pager, next" :current-page.sync="currentPage" :page-size="pageSize" :total="activityList.length"></el-pagination>
          </div>
        </el-card>
      </div>
  
      <el-dialog title="编辑活动" :visible.sync="editVisible" width="600px">
        <el-form :model="editForm" label-width="100px" size="small">
          <el-form-item label="活动名称"><el-input v-model="editForm.activityName"></el-input></el-form-item>
          <el-form-item label="地点"><el-input v-model="editForm.location"></el-input></el-form-item>
          <el-form-item label="限制人数"><el-input-number v-model="editForm.maxPeople" :min="0"></el-input-number></el-form-item>
          <el-form-item label="起止时间">
            <el-date-picker v-model="timeRange" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="详情"><el-input type="textarea" v-model="editForm.content" :rows="5"></el-input></el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="editVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpdate" :loading="updating">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userInfo: {}, activityList: [], loading: false, currentPage: 1, pageSize: 8,
        editVisible: false, updating: false, editForm: {}, timeRange: []
      };
    },
    computed: {
      pagedActivityList() {
        return this.activityList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      }
    },
    created() {
      const user = JSON.parse(localStorage.getItem("loginUser") || "{}");
      this.userInfo = user;
      this.fetchMyActivities();
    },
    methods: {
      fetchMyActivities() {
        this.loading = true;
        this.$axios.get("/api/leader/activity/list", { params: { leaderId: this.userInfo.id } }).then(res => {
          if (res.data.code === 200) this.activityList = res.data.data || [];
        }).finally(() => { this.loading = false; });
      },
      handleEdit(row) {
        this.editForm = { ...row };
        this.timeRange = [row.startTime, row.endTime];
        this.editVisible = true;
      },
      submitUpdate() {
        if (this.timeRange) {
          this.editForm.startTime = this.timeRange[0];
          this.editForm.endTime = this.timeRange[1];
        }
        this.updating = true;
        this.$axios.post("/api/leader/activity/update", this.editForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success("修改成功");
            this.editVisible = false;
            this.fetchMyActivities();
          }
        }).finally(() => { this.updating = false; });
      },
      handleDelete(id) {
        this.$axios.post(`/api/leader/activity/del?id=${id}`).then(res => {
          if (res.data.code === 200) {
            this.$message.success("删除成功");
            this.fetchMyActivities();
          }
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
  .card-header { display: flex; justify-content: space-between; align-items: center; }
  .table-cover { width: 80px; height: 50px; border-radius: 4px; }
  .pagination-container { margin-top: 20px; display: flex; justify-content: center; }
  </style>