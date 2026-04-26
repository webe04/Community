<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="title">校园社团管理系统 - 注册</h2>
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        label-width="100px"
        class="register-form"
      >
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="registerForm.userType" placeholder="请选择用户类型">
            <el-option label="普通学生" value="student"></el-option>
            <el-option label="社团负责人" value="leader"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入学号/工号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码（不少于6位）"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="registerForm.confirmPwd"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="registerForm.name" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>

        <!-- 学生：兴趣标签 -->
        <el-form-item
          label="兴趣标签"
          prop="tags"
          v-if="registerForm.userType === 'student'"
        >
          <el-select
            v-model="registerForm.tags"
            multiple
            placeholder="请选择至少1个兴趣标签"
          >
            <el-option
              v-for="tag in tagOptions"
              :key="tag.value"
              :label="tag.label"
              :value="tag.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="MBTI性格"
          prop="mbti"
          v-if="registerForm.userType === 'student'"
        >
          <el-select v-model="registerForm.mbti" placeholder="请选择MBTI类型">
            <el-option label="ISTJ" value="ISTJ"></el-option>
            <el-option label="ISFJ" value="ISFJ"></el-option>
            <el-option label="INFJ" value="INFJ"></el-option>
            <el-option label="INTJ" value="INTJ"></el-option>
            <el-option label="ISTP" value="ISTP"></el-option>
            <el-option label="ISFP" value="ISFP"></el-option>
            <el-option label="INFP" value="INFP"></el-option>
            <el-option label="INTP" value="INTP"></el-option>
            <el-option label="ESTP" value="ESTP"></el-option>
            <el-option label="ESFP" value="ESFP"></el-option>
            <el-option label="ENFP" value="ENFP"></el-option>
            <el-option label="ENTP" value="ENTP"></el-option>
            <el-option label="ESTJ" value="ESTJ"></el-option>
            <el-option label="ESFJ" value="ESFJ"></el-option>
            <el-option label="ENFJ" value="ENFJ"></el-option>
            <el-option label="ENTJ" value="ENTJ"></el-option>
          </el-select>
        </el-form-item>

        <!-- 负责人：社团名称 -->
        <el-form-item
          label="所属社团"
          prop="clubName"
          v-if="registerForm.userType === 'leader'"
        >
          <el-input v-model="registerForm.clubName" placeholder="请输入负责的社团名称"></el-input>
        </el-form-item>

        <el-form-item class="btn-group">
          <el-button type="primary" @click="submitForm">提交注册</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="text" @click="toLogin" class="login-btn">已有账号？立即登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "RegisterPage",
  data() {
    // 确认密码校验
    const validateConfirmPwd = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    // 学生必须选标签
    const validateTags = (rule, value, callback) => {
      if (this.registerForm.userType === "student" && (!value || value.length === 0)) {
        callback(new Error("请至少选择一个兴趣标签"));
      } else {
        callback();
      }
    };

    return {
      registerForm: {
        userType: "student",
        username: "",
        password: "",
        confirmPwd: "",
        name: "",
        phone: "",
        tags: [],
        mbti: "",
        clubName: "",
      },
      tagOptions: [
        { label: "科技", value: "科技" },
        { label: "编程", value: "编程" },
        { label: "算法", value: "算法" },
        { label: "运动", value: "运动" },
        { label: "艺术", value: "艺术" },
        { label: "文艺", value: "文艺" },
        { label: "志愿服务", value: "志愿服务" },
        { label: "语言", value: "语言" },
        { label: "摄影", value: "摄影" },
        { label: "音乐", value: "音乐" },
        { label: "吉他", value: "吉他" },
      ],
      registerRules: {
        userType: [{ required: true, message: "请选择用户类型", trigger: "change" }],
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不少于6位", trigger: "blur" },
        ],
        confirmPwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: validateConfirmPwd, trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
        ],
        tags: [{ validator: validateTags, trigger: "change" }],
        mbti: [{ required: true, message: "请选择MBTI类型", trigger: "change" }],
        clubName: [{ required: true, message: "请输入所属社团名称", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/register", this.registerForm)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success("注册成功！即将跳转至登录页");
                setTimeout(() => {
                  this.$router.push("/login");
                }, 1500);
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(() => {
              this.$message.error("注册失败");
            });
        }
      });
    },
    resetForm() {
      this.$refs.registerForm.resetFields();
    },
    toLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.register-card {
  width: 600px;
  padding: 30px;
}
.title {
  text-align: center;
  color: #1989fa;
  margin-bottom: 20px;
}
.btn-group {
  text-align: center;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>