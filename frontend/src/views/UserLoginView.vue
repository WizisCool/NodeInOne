<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <h1 class="login-title">OneSub管理面板</h1>
        <p class="login-subtitle">Manage your nodes easily</p>
      </div>
      <div class="login-action">
        <a href="/auth/github">
          <el-button type="primary" size="large">
            <el-icon>
              <User />
            </el-icon>
            通过 GitHub 登录
          </el-button>
        </a>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserLoginView',
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-logo {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.login-subtitle {
  font-size: 14px;
  color: #909399;
}

.login-action {
  text-align: center;
  margin-top: 20px;
}
</style>
