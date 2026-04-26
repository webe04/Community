<template>
  <div class="admin-container">
    <div class="page-header">
      <div class="header-left">
        <el-button icon="el-icon-back" size="mini" @click="$router.push('/admin/home')">返回看板</el-button>
        <h2 class="page-title"><i class="el-icon-picture"></i> 轮播图配置</h2>
      </div>
      <div class="header-right">
        <el-popconfirm title="确定退出系统吗？" @confirm="logout">
          <template #reference>
            <el-button type="danger" size="small" icon="el-icon-switch-button" plain>退出登录</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="首页展示" name="0"></el-tab-pane>
      <el-tab-pane label="活动页展示" name="1"></el-tab-pane>
      
      <div class="table-tool">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">
          新增{{ activeTab === '0' ? '首页' : '活动页' }}图片
        </el-button>
      </div>

      <el-table :data="pagedFilteredList" stripe v-loading="loading">
        <el-table-column label="预览图" width="300">
          <template #default="{row}">
            <el-image :src="row.imgUrl" class="table-img" :preview-src-list="[row.imgUrl]" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="编号" />
        <el-table-column label="操作" align="right" width="150">
          <template #default="{row}">
            <el-popconfirm title="确定删除吗？" @confirm="delBanner(row.id)">
              <template #reference><el-button type="danger" size="mini" plain icon="el-icon-delete">删除</el-button></template>
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
          :total="filteredList.length">
        </el-pagination>
      </div>
    </el-tabs>

    <el-dialog :title="'新增轮播图'" :visible.sync="bannerShow" width="460px" @close="resetForm">
      <div class="upload-wrapper">
        <el-upload class="banner-uploader" action="/api/upload/img" :on-success="handleUploadSuccess" :show-file-list="false" drag>
          <template v-if="!bannerForm.imgUrl">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </template>
          <img v-else :src="bannerForm.imgUrl" class="preview-img">
        </el-upload>
      </div>
      <div slot="footer">
        <el-button @click="bannerShow = false" size="small">取消</el-button>
        <el-button type="primary" @click="submitAdd" size="small" :loading="submitting">确认添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: '0',
      loading: false,
      submitting: false,
      bannerShow: false,
      bannerList: [],
      bannerForm: { imgUrl: '', type: 0 },
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    filteredList() {
      return this.bannerList.filter(item => String(item.type) === this.activeTab);
    },
    pagedFilteredList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      return this.filteredList.slice(start, end);
    }
  },
  watch: {
    activeTab() { this.currentPage = 1; }
  },
  created() { this.getBanner(); },
  methods: {
    logout() { localStorage.removeItem("loginUser"); this.$router.push('/login'); this.$message.success("已成功退出登录"); },
    getBanner() {
      this.loading = true;
      this.$axios.get("/api/admin/banner/list").then(res => { this.bannerList = res.data.data || []; this.loading = false; });
    },
    openAddDialog() { this.bannerForm.type = parseInt(this.activeTab); this.bannerShow = true; },
    handleUploadSuccess(res) { this.bannerForm.imgUrl = res.data; this.$message.success("上传成功"); },
    submitAdd() {
      if (!this.bannerForm.imgUrl) return this.$message.warning("请上传图片");
      this.submitting = true;
      this.$axios.post("/api/admin/banner/add", this.bannerForm).then(() => {
        this.getBanner(); this.bannerShow = false; this.submitting = false; this.resetForm();
      }).catch(() => { this.submitting = false; });
    },
    delBanner(id) { this.$axios.post(`/api/admin/banner/del?id=${id}`).then(() => { this.getBanner(); }); },
    resetForm() { this.bannerForm = { imgUrl: '', type: parseInt(this.activeTab) }; }
  }
}
</script>

<style scoped>
.admin-container { padding: 40px; background-color: #f5f7fa; min-height: 100vh; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header-left { display: flex; align-items: center; gap: 20px; }
.page-title { font-size: 24px; color: #303133; margin: 0; }
.table-tool { margin: 15px 0; }
.table-img { width: 220px; height: 100px; border-radius: 4px; }
.upload-wrapper { display: flex; justify-content: center; padding: 10px 0; }
.banner-uploader ::v-deep .el-upload-dragger { width: 360px !important; height: 180px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.preview-img { width: 100%; height: 100%; object-fit: contain; }
.pagination-container { margin-top: 20px; display: flex; justify-content: center; }
</style>