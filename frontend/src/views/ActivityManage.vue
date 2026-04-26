<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <el-button icon="el-icon-back" size="mini" @click="$router.push('/admin/home')">返回看板</el-button>
        <h2 class="page-title"><i class="el-icon-date"></i> 活动审核管理</h2>
      </div>
      <div class="header-right">
        <el-popconfirm title="确定退出系统吗？" @confirm="logout">
          <template #reference>
            <el-button type="danger" size="small" icon="el-icon-switch-button" plain>退出登录</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <el-card>
      <el-table :data="pagedActivityList" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="活动名称">
          <template #default="{row}">
            <el-link type="primary" @click="showDetail(row)">{{ row.activityName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="120">
          <template #default="{row}">
            <el-image :src="row.cover" style="width: 80px; height: 50px; border-radius: 4px" fit="cover" :preview-src-list="[row.cover]" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{row}">
            <el-tag v-if="row.status === 1" type="success">已通过</el-tag>
            <el-tag v-else-if="row.status === 2" type="danger">已拒绝</el-tag>
            <el-tag v-else type="warning">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="right">
          <template #default="{row}">
            <el-button @click="showDetail(row)" type="text">详情</el-button>
            <el-button @click="audit(row.id, 1)" type="success" size="mini" :disabled="row.status !== 0">通过</el-button>
            <el-button @click="audit(row.id, 2)" type="danger" size="mini" :disabled="row.status !== 0">拒绝</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(row.id)" style="margin-left:10px">
              <template #reference><el-button type="text" style="color:red" icon="el-icon-delete">删除</el-button></template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :total="activityList.length">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="活动详情" :visible.sync="detailVisible" width="500px">
      <div class="detail-content" v-if="currentActivity">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="活动名称">{{ currentActivity.activityName }}</el-descriptions-item>
          <el-descriptions-item label="活动封面">
            <el-image :src="currentActivity.cover" style="width: 200px; height: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="活动内容">
            <div style="max-height: 200px; overflow-y: auto;">
              {{ currentActivity.content || '暂无详细描述' }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentActivity.createTime || '未知' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer">
        <el-button @click="detailVisible = false">关闭</el-button>
        <template v-if="currentActivity && currentActivity.status === 0">
           <el-button type="danger" @click="audit(currentActivity.id, 2)">拒绝</el-button>
           <el-button type="success" @click="audit(currentActivity.id, 1)">通过</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activityList: [],
      loading: false,
      detailVisible: false,
      currentActivity: null,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    pagedActivityList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.activityList.slice(start, end);
    }
  },
  created() { this.getList(); },
  methods: {
    logout() { localStorage.removeItem("loginUser"); this.$router.push('/login'); this.$message.success("已成功退出登录"); },
    getList() {
      this.loading = true;
      this.$axios.get("/api/admin/activity/all").then(res => {
        this.activityList = res.data.data || [];
        this.loading = false;
      });
    },
    showDetail(row) { this.currentActivity = row; this.detailVisible = true; },
    audit(id, status) {
      this.$axios.post(`/api/admin/activity/audit?id=${id}&status=${status}`).then(() => {
        this.$message.success("操作成功");
        this.detailVisible = false;
        this.getList();
      });
    },
    del(id) {
      this.$axios.get(`/api/admin/activity/del?id=${id}`).then(() => {
        this.$message.success("已删除");
        this.getList();
      });
    }
  }
}
</script>

<style scoped>
.admin-container { padding: 40px; background-color: #f5f7fa; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header-left { display: flex; align-items: center; gap: 20px; }
.page-title { font-size: 24px; color: #303133; margin: 0; }
.detail-content { padding: 10px; }
.pagination-container { margin-top: 20px; display: flex; justify-content: center; }
</style>