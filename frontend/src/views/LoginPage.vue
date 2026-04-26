<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">校园社团管理系统 - 登录</h2>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
      >
        <!-- 用户类型选择 -->
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="loginForm.userType" placeholder="请选择用户类型">
            <el-option label="普通学生" value="student"></el-option>
            <el-option label="社团负责人" value="leader"></el-option>
            <el-option label="系统管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>

        <!-- 用户名/账号 -->
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入学号/工号/管理员账号"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="submitLogin"
          ></el-input>
        </el-form-item>

        <!-- 记住密码 -->
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>

        <!-- 操作按钮组-->
        <el-form-item class="btn-group">
          <el-button type="primary" @click="submitLogin">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="text" @click="toRegister" class="register-btn">还没有账号？立即注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      loginForm: {
        userType: "",
        username: "",
        password: "",
        remember: false
      },
      loginRules: {
        userType: [{ required: true, message: "请选择用户类型", trigger: "change" }],
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    const rememberInfo = localStorage.getItem("loginRemember");
    if (rememberInfo) {
      const info = JSON.parse(rememberInfo);
      this.loginForm = { ...this.loginForm, ...info };
    }
  },
  methods: {
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 登录成功 —— 三端自动跳转
          this.$axios.post("/api/login", this.loginForm).then(res => {
            if (res.data.code === 200) {
              localStorage.setItem("loginUser", JSON.stringify(res.data.data));
              const userType = res.data.data.userType;

              // 根据角色跳转
              if (userType === "student") {
                this.$message.success("学生登录成功");
                this.$router.push("/student/home");
              } 
              else if (userType === "leader") {
                this.$message.success("社团负责人登录成功");
                this.$router.push("/leader/home");
              } 
              else if (userType === "admin") {
                this.$message.success("管理员登录成功");
                this.$router.push("/admin/home");
              } 
              else {
                this.$message.error("未知用户类型");
              }
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    toRegister() {
      this.$router.push({ 
        path: '/register',
        replace: true 
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 500px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #1989fa;
}

.login-form {
  margin-top: 10px;
}

.btn-group {
  margin: 20px 0 0 0; /* 调整外边距，贴合表单 */
  text-align: center; /* 按钮居中 */
  display: flex;
  justify-content: center; /* 水平居中 */
  gap: 10px; /* 按钮之间的间距 */
}

/* 注册按钮样式优化 */
.register-btn {
  color: #1989fa;
  margin-left: 5px;
}
</style>