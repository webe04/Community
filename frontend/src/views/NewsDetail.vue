<template>
    <div class="news-detail">
      <div class="detail-container">
        <el-page-header @back="$router.back()" content="公告详情" class="back-header"></el-page-header>
        
        <div v-if="newsInfo.id">
          <div class="article-header">
            <h1 class="article-title">{{ newsInfo.title }}</h1>
            <div class="article-meta">
              <span><i class="el-icon-date"></i> 发布时间：{{ formatFullTime(newsInfo.publishTime) }}</span>
              <span><i class="el-icon-user"></i> 发布人：{{ newsInfo.publisher || '管理员' }}</span>
            </div>
          </div>
          
          <div class="article-content" v-html="newsInfo.content"></div>
        </div>
  
        <el-empty v-else description="内容加载中或不存在..." />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NewsDetail",
    data() {
      return {
        newsInfo: {}
      };
    },
    created() {
      const newsId = this.$route.params.id;
      this.$axios.get(`/api/news/detail/${newsId}`).then(res => {
        this.newsInfo = res.data.data || {};
      }).catch(() => {
        this.$message.error("获取公告失败");
      });
    },
    methods: {
      formatFullTime(timeStr) {
        if (!timeStr) return '-';
        const date = new Date(timeStr);
        return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .news-detail { padding: 100px 0 50px; background: #f5f7fa; min-height: 100vh; }
  .detail-container { width: 900px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  .back-header { margin-bottom: 30px; }
  
  .article-header { text-align: center; margin-bottom: 40px; }
  .article-title { font-size: 26px; color: #2c3e50; margin-bottom: 20px; line-height: 1.4; }
  .article-meta { font-size: 14px; color: #9499a0; display: flex; justify-content: center; gap: 30px; padding-bottom: 20px; border-bottom: 1px solid #ebeef5; }
  
  .article-content { 
    font-size: 16px; 
    color: #333; 
    line-height: 2; 
    letter-spacing: 0.5px;
  }
  .article-content >>> img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 20px auto;
  }
  </style>