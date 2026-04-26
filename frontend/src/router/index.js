import Vue from 'vue'
import VueRouter from 'vue-router'

// 基础组件
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'

//学生端
import StudentHome from '../views/StudentHome.vue'
import ClubView from '../views/ClubView.vue'
import ClubDetail from '../views/ClubDetail.vue'
import ActivityCenter from '../views/ActivityCenter.vue'
import ActivityDetail from '../views/ActivityDetail.vue'
import Profile from '../views/StudentProfile.vue'
import NewsDetail from '@/views/NewsDetail.vue'
import MyJoin from '../views/MyJoin.vue' 


//社团负责人端
import LeaderHome from '../views/LeaderHome.vue'
import PublishActivity from '../views/PublishActivity.vue'
import LeaderInfo from '../views/LeaderInfo.vue' 
import MemberManage from '../views/MemberManage.vue' 
import MemberRecommend from '../views/PotentialMembers.vue'

//管理员端组件
import AdminHome from '@/views/AdminHome.vue'
import BannerManage from '../views/BannerManage.vue'
import NewsManage from '../views/NewsManage.vue'
import ActivityManage from '../views/ActivityManage.vue'
import ClubAudit from '../views/ClubAudit.vue'
import ClubApply from '../views/ClubApply.vue'
import LeaderActivity from '@/views/LeaderActivity.vue'



Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },

  // --- 学生端 ---
  { path: '/student/home', component: StudentHome },
  { path: '/student/club', component: ClubView },
  { path: '/student/activity', component: ActivityCenter },
  { path: '/student/profile', component: Profile },
  { path: '/student/club/detail/:id', component: ClubDetail },
  { path: '/student/news/detail/:id', name: 'NewsDetail', component: NewsDetail },
  { path: '/student/activity/detail/:id', name: 'ActivityDetail', component: ActivityDetail },
  { path: '/student/my-join', name: 'MyJoin', component: MyJoin },

  // --- 负责人端 ---
  { path: '/leader/home', component: LeaderHome },
  { path: '/leader/info', component: LeaderInfo },
  { path: '/leader/profile', component: Profile },
  { path: '/leader/activity/publish', component: PublishActivity },
  { path: '/leader/member', component: MemberManage },
  { path: '/leader/apply', name: 'ClubApply', component: ClubApply },
  { path: '/leader/activity/manage', name :'LeaderActivity',component: LeaderActivity},
  { path: '/leader/member/recommend', name : 'MemberRecommend',component : MemberRecommend},
  

  // --- 管理员端 ---
  { path: '/admin/home', name: 'AdminHome', component: AdminHome },
  { path: '/admin/banner', name: 'BannerManage', component: BannerManage },
  { path: '/admin/news', name: 'NewsManage', component: NewsManage },
  { path: '/admin/activity', name: 'ActivityManage', component: ActivityManage },
  { path: '/admin/club-audit', name: 'ClubAudit', component: ClubAudit }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userJson = localStorage.getItem("loginUser");
  
  if (to.path === '/login' || to.path === '/register') {
    return next();
  }

  if (!userJson) {
    return next('/login');
  }

  const user = JSON.parse(userJson);
  
  // 权限控制
  if (to.path.startsWith('/admin') && user.userType !== 'admin') {
    return next('/login');
  }
  if (to.path.startsWith('/leader') && user.userType !== 'leader') {
    return next('/login');
  }
  // 学生端权限
  if (to.path.startsWith('/student') && user.userType !== 'student') {
    return next('/login');
  }

  next();
});

export default router