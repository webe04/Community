<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <el-button icon="el-icon-back" size="mini" @click="$router.push('/admin/home')">返回看板</el-button>
        <h2 class="page-title"><i class="el-icon-news"></i> 新闻公告管理</h2>
      </div>
      <div class="header-right">
        <el-popconfirm title="确定退出系统吗？" @confirm="logout">
          <template #reference>
            <el-button type="danger" size="small" icon="el-icon-switch-button" plain>退出登录</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <el-card shadow="never">
      <div slot="header" class="card-header">
        <span style="font-weight: bold">资讯列表</span>
        <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">发布资讯</el-button>
      </div>

      <el-table :data="pagedNewsList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号" width="80" align="center" />
        <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
        <el-table-column prop="publishTime" label="发布时间" width="180" align="center" />
        <el-table-column label="操作" width="160" align="center">
          <template #default="{row}">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="delNews(row.id)" style="margin-left: 10px">
              <template #reference>
                <el-button type="text" style="color: #f56c6c" icon="el-icon-delete">删除</el-button>
              </template>
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
          :total="newsList.length">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog :visible.sync="newsShow" :title="isEdit ? '编辑新闻' : '发布资讯'" width="600px" @closed="resetForm">
      <el-form :model="newsForm" label-position="top">
        <el-form-item label="新闻标题"><el-input v-model="newsForm.title" maxlength="100" show-word-limit /></el-form-item>
        <el-form-item label="新闻正文"><el-input type="textarea" :rows="8" v-model="newsForm.content" /></el-form-item>
      </el-form>
      <div slot="footer"><el-button @click="newsShow = false">取消</el-button><el-button type="primary" @click="saveNews">确定</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return { loading: false, newsList: [], newsShow: false, isEdit: false, newsForm: { id: null, title: '', content: '' }, currentPage: 1, pageSize: 10 };
  },
  computed: {
    pagedNewsList() {
      return this.newsList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  created() { this.getNews(); },
  methods: {
    logout() { localStorage.removeItem("loginUser"); this.$router.push('/login'); this.$message.success("账号已退出"); },
    getNews() {
      this.loading = true;
      this.$axios.get("/api/admin/news/list").then(res => { this.newsList = res.data.data || []; }).finally(() => { this.loading = false; });
    },
    handleAdd() { this.isEdit = false; this.resetForm(); this.newsShow = true; },
    handleEdit(row) { this.isEdit = true; this.newsForm = { ...row }; this.newsShow = true; },
    resetForm() { this.newsForm = { id: null, title: '', content: '' }; },
    saveNews() {
      const url = this.isEdit ? "/api/admin/news/update" : "/api/admin/news/add";
      this.$axios.post(url, this.newsForm).then(() => {
        this.$message.success("操作成功"); this.newsShow = false; this.getNews();
      });
    },
    delNews(id) { this.$axios.post(`/api/admin/news/del?id=${id}`).then(() => { this.$message.success("已删除"); this.getNews(); }); }
  }
}
</script>

<style scoped>
.admin-container { padding: 30px; background-color: #f0f2f5; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
.header-left { display: flex; align-items: center; gap: 15px; }
.page-title { font-size: 22px; font-weight: 600; color: #1f2f3d; margin: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.pagination-container { margin-top: 20px; display: flex; justify-content: center; }
</style>