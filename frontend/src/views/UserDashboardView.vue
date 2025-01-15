<template>
  <div class="subscription-container">
    <h1>订阅管理系统</h1>
    <el-card class="subscription-card">
      <div class="header">
        <h2>订阅列表</h2>
        <el-button type="primary" circle icon="el-icon-plus" @click="openAddSubscriptionModal">新增</el-button>
      </div>

      <el-table :data="subscriptions" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column label="链接数量" width="120">
          <template #default="scope">
            {{ scope.row.links.length }}
          </template>
        </el-table-column>
        <el-table-column label="订阅地址">
          <template #default="scope">
            <el-input :value="getSubscriptionLink(scope.row)" readonly></el-input>
            <el-button type="primary" icon="el-icon-document-copy" circle
              @click="copySubscriptionLink(scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="启用" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" @change="toggleSubscriptionStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="editSubscription(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteSubscription(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="新建订阅" v-model="addSubscriptionModalVisible">
      <el-form :model="newSubscription" label-width="100px">
        <el-form-item label="订阅名称">
          <el-input v-model="newSubscription.name"></el-input>
        </el-form-item>
        <el-form-item label="订阅链接">
          <div v-for="(link, index) in newSubscription.links" :key="index" class="link-input">
            <el-input v-model="newSubscription.links[index]"></el-input>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeNewLink(index)"></el-button>
          </div>
          <el-button type="primary" icon="el-icon-plus" @click="addNewLink">添加链接</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addSubscriptionModalVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddSubscription">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="编辑订阅" v-model="editSubscriptionModalVisible">
      <el-form :model="editSubscriptionData" label-width="100px">
        <el-form-item label="订阅名称">
          <el-input v-model="editSubscriptionData.name"></el-input>
        </el-form-item>
        <el-form-item label="订阅链接">
          <div v-for="(link, index) in editSubscriptionData.links" :key="index" class="link-input">
            <el-input v-model="editSubscriptionData.links[index]"></el-input>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeEditLink(index)"></el-button>
          </div>
          <el-button type="primary" icon="el-icon-plus" @click="addEditLink">添加链接</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editSubscriptionModalVisible = false">取消</el-button>
        <el-button type="primary" @click="onEditSubscription">保存</el-button>
      </template>
    </el-dialog>

    <footer>
      NodeInOne ©2025 Created by 董俊泽
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  name: 'UserDashboardView',
  data() {
    return {
      subscriptions: [],
      newSubscription: { name: '', links: [''] },
      addSubscriptionModalVisible: false,
      editSubscriptionModalVisible: false,
      editSubscriptionData: { id: null, name: '', links: [] },
    };
  },
  async created() {
    await this.fetchSubscriptions();
  },
  methods: {
    async fetchSubscriptions() {
      try {
        const response = await axios.get('/api/subscriptions');
        this.subscriptions = response.data;
      } catch (err) {
        ElMessage.error('加载订阅失败，请稍后重试');
        console.error(err);
      }
    },
    async onAddSubscription() {
      try {
        const response = await axios.post('/api/subscriptions', this.newSubscription);
        this.subscriptions.push(response.data);
        this.newSubscription = { name: '', links: [''] };
        this.addSubscriptionModalVisible = false;
        ElMessage.success('订阅添加成功');
      } catch (err) {
        ElMessage.error('添加订阅失败，请稍后重试');
        console.error(err);
      }
    },
    async deleteSubscription(id) {
      try {
        await axios.delete(`/api/subscriptions/${id}`);
        this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
        ElMessage.success('订阅删除成功');
      } catch (err) {
        ElMessage.error('删除订阅失败，请稍后重试');
        console.error(err);
      }
    },
    async toggleSubscriptionStatus(subscription) {
      try {
        await axios.put(`/api/subscriptions/${subscription.id}/status`, { enabled: subscription.enabled });
        ElMessage.success('订阅状态已更新');
      } catch (err) {
        subscription.enabled = !subscription.enabled; // 回滚状态
        ElMessage.error('更新订阅状态失败，请稍后重试');
        console.error(err);
      }
    },
    async editSubscription(subscription) {
      this.editSubscriptionData = { ...subscription, links: [...subscription.links] };
      this.editSubscriptionModalVisible = true;
    },
    async onEditSubscription() {
      try {
        await axios.put(`/api/subscriptions/${this.editSubscriptionData.id}`, this.editSubscriptionData);
        const index = this.subscriptions.findIndex(sub => sub.id === this.editSubscriptionData.id);
        if (index !== -1) {
          this.subscriptions[index] = { ...this.editSubscriptionData };
        }
        this.editSubscriptionModalVisible = false;
        ElMessage.success('订阅保存成功');
      } catch (err) {
        ElMessage.error('保存订阅失败，请稍后重试');
        console.error(err);
      }
    },
    getSubscriptionLink(subscription) {
      return `${window.location.origin}/subscriptions/${subscription.id}`;
    },
    copySubscriptionLink(subscription) {
      navigator.clipboard.writeText(this.getSubscriptionLink(subscription)).then(() => {
        ElMessage.success('订阅链接已复制');
      }).catch(() => {
        ElMessage.error('复制订阅链接失败');
      });
    },
    addNewLink() {
      this.newSubscription.links.push('');
    },
    removeNewLink(index) {
      this.newSubscription.links.splice(index, 1);
    },
    addEditLink() {
      this.editSubscriptionData.links.push('');
    },
    removeEditLink(index) {
      this.editSubscriptionData.links.splice(index, 1);
    },
    openAddSubscriptionModal() {
      this.addSubscriptionModalVisible = true;
    },
  },
};
</script>

<style scoped>
.subscription-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.subscription-card {
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.link-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

footer {
  margin-top: 30px;
  font-size: 14px;
  color: #aaa;
}
</style>
