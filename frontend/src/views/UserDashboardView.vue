<template>
  <div class="subscription-container">
    <h1 class="title">OneSub</h1>
    <el-card class="subscription-card">
      <div class="header">
        <h2>订阅列表</h2>
        <div class="header-buttons">
          <el-button type="danger" plain size="medium" @click="logout" class="logout-btn">
            <el-icon>
              <SwitchButton />
            </el-icon> 登出
          </el-button>
          <el-button type="primary" plain size="medium" @click="openAddSubscriptionModal">
            <el-icon>
              <Plus />
            </el-icon> 添加
          </el-button>
        </div>
      </div>

      <el-table :data="subscriptions" class="subscription-table">
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column label="链接数量" align="center" width="120">
          <template #default="scope">
            {{ scope.row.links.length }}
          </template>
        </el-table-column>
        <el-table-column label="订阅地址" align="center" width="300">
          <template #default="scope">
            <div class="link-container" @click="copySubscriptionLink(scope.row)">
              <span class="link" :title="getSubscriptionLink(scope.row)">
                {{ getSubscriptionLink(scope.row) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-space size="small">
              <el-button type="primary" round size="small" @click="editSubscription(scope.row)">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button type="primary" round size="small" @click="copySubscriptionLink(scope.row)">
                <el-icon>
                  <DocumentCopy />
                </el-icon>
              </el-button>
              <el-popconfirm title="确定要删除此订阅吗？" confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-warning"
                @confirm="deleteSubscription(scope.row.id)">
                <template #reference>
                  <el-button type="danger" round size="small">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </el-space>
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
          <el-space direction="vertical" size="medium" fill>
            <div v-for="(link, index) in newSubscription.links" :key="index" class="link-input">
              <el-space size="small" alignment="center">
                <el-input v-model="newSubscription.links[index]"></el-input>
                <el-button type="danger" size="small" @click="removeNewLink(index)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </el-space>
            </div>
            <el-button type="primary" plain size="small" @click="addNewLink">
              <el-icon>
                <Plus />
              </el-icon> 添加链接
            </el-button>
          </el-space>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button plain @click="addSubscriptionModalVisible = false">取消</el-button>
        <el-button type="primary" plain @click="onAddSubscription">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="编辑订阅" v-model="editSubscriptionModalVisible">
      <el-form :model="editSubscriptionData" label-width="100px">
        <el-form-item label="订阅名称">
          <el-input v-model="editSubscriptionData.name"></el-input>
        </el-form-item>
        <el-form-item label="订阅链接">
          <el-space direction="vertical" size="medium" fill>
            <div v-for="(link, index) in editSubscriptionData.links" :key="index" class="link-input">
              <el-space size="small" alignment="center">
                <el-input v-model="editSubscriptionData.links[index]"></el-input>
                <el-button type="danger" size="small" @click="removeEditLink(index)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </el-button>
              </el-space>
            </div>
            <el-button plain type="primary" size="small" @click="addEditLink">
              <el-icon>
                <Plus />
              </el-icon> 添加链接
            </el-button>
          </el-space>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button plain @click="editSubscriptionModalVisible = false">取消</el-button>
        <el-button type="primary" plain @click="onEditSubscription">保存</el-button>
      </template>
    </el-dialog>

    <footer class="footer">
      <div>
        <a href="https://github.com/WizisCool" target="_blank" class="footer-link">@WizisCool</a>
        <span> | </span>
        <a href="https://github.com/WizisCool/OneSub" target="_blank" class="footer-link">项目仓库</a>
      </div>
      <div>OneSub ©2025</div>
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
    async logout() {
      try {
        await axios.get('/logout');
        window.location.href = '/';
      } catch (err) {
        ElMessage.error('登出失败，请稍后重试');
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
}

.title {
  text-align: left;
  font-size: 24px;
  font-weight: bold;
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

.header-buttons {
  display: flex;
  gap: 10px;
}

.subscription-table .el-table__header-wrapper {
  text-align: center;
}

.link-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.link {
  color: #409eff;
  text-decoration: none;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  margin-left: 5px;
}

.footer {
  margin-top: 30px;
  font-size: 14px;
  color: #aaa;
  text-align: center;
}

.footer-link {
  color: #409eff;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
