<template>
    <div class="admin-container">
      <div class="page-header">
        <div class="header-left">
          <el-button icon="el-icon-back" size="mini" @click="$router.push('/admin/home')">返回看板</el-button>
          <h2 class="page-title"><i class="el-icon-office-building"></i> 社团建社申请审核</h2>
        </div>
        <div class="header-right">
          <el-popconfirm title="确定退出系统吗？" @confirm="logout">
            <template #reference>
              <el-button type="danger" size="small" icon="el-icon-switch-button" plain>退出登录</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
  
      <el-card shadow="never" style="border-radius: 8px;">
        <div slot="header" class="clearfix">
          <span><b>📌 待处理申请列表</b></span>
        </div>
        
        <el-table :data="pagedTableData" border stripe style="width: 100%" v-loading="loading">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="clubName" label="社团名称" width="180"></el-table-column>
          <el-table-column prop="category" label="社团分类" width="150"></el-table-column>
          <el-table-column prop="tags" label="标签" width="180">
            <template slot-scope="scope">
               <el-tag size="mini" v-for="tag in (scope.row.tags||'').split(',')" :key="tag" style="margin-right:5px">{{tag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="intro" label="社团简介" show-overflow-tooltip></el-table-column>
          <el-table-column label="社团Logo" width="100" align="center">
            <template slot-scope="scope">
              <el-image 
                v-if="scope.row.logo"
                style="width: 45px; height: 45px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                :src="getImgUrl(scope.row.logo)" 
                :preview-src-list="[getImgUrl(scope.row.logo)]">
              </el-image>
              <span v-else style="color: #999; font-size: 12px;">无Logo</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="success" icon="el-icon-check" @click="handleAudit(scope.row.id, 1)">通过</el-button>
              <el-button size="mini" type="danger" icon="el-icon-close" @click="handleAudit(scope.row.id, -1)">驳回</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :total="tableData.length">
          </el-pagination>
        </div>
      </el-card>
    </div>
</template>
  
<script>
export default {
  data() {
    return { tableData: [], loading: false, currentPage: 1, pageSize: 10 }
  },
  computed: {
    pagedTableData() {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  created() { this.loadPendingClubs(); },
  methods: {
    logout() { localStorage.removeItem("loginUser"); this.$router.push('/login'); this.$message.success("已成功退出登录"); },
    getImgUrl(path) { return !path ? '' : (path.includes('http') ? path : 'http://localhost:9090' + path); },
    loadPendingClubs() {
      this.loading = true;
      this.$axios.get('/api/admin/club/pending').then(res => {
        this.loading = false;
        if(res.data.code == 200) this.tableData = res.data.data || [];
      }).catch(() => { this.loading = false; });
    },
    handleAudit(id, status) {
      this.$confirm(`确认要 ${status === 1 ? '通过' : '驳回'} 该申请吗?`, '提示', { type: status === 1 ? 'success' : 'warning' }).then(() => {
        this.$axios.post(`/api/admin/club/audit?id=${id}&status=${status}`).then(res => {
          if (res.data.code == 200) { this.$message.success('审核成功'); this.loadPendingClubs(); }
        });
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
.pagination-container { margin-top: 20px; display: flex; justify-content: center; }
</style>