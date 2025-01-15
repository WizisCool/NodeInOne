<template>
  <div class="login">
    <h1>NodeInOne Login</h1>
    <a href="/auth/github">
      <el-button type="primary">Login with GitHub</el-button>
    </a>
  </div>
</template>

<script>
export default {
  name: 'UserLoginView',
};
</script>

<style scoped>
.login {
  text-align: center;
  margin-top: 50px;
}
</style>