<script setup lang="ts">
import type { NotifyItem } from "./type";
import { Bell } from "@element-plus/icons-vue";
import { messageData, notifyData, todoData } from "./data";
import List from "./List.vue";

type TabName = "notify" | "message" | "todo";

interface DataItem {
  name: TabName;
  type: "primary" | "success" | "warning" | "danger" | "info";
  list: NotifyItem[];
}

const activeName = ref<TabName>("notify");

const data = ref<DataItem[]>([
  {
    name: "notify",
    type: "primary",
    list: notifyData,
  },
  {
    name: "message",
    type: "danger",
    list: messageData,
  },
  {
    name: "todo",
    type: "warning",
    list: todoData,
  },
]);

const badgeValue = computed(() =>
  data.value.reduce((sum, item) => sum + item.list.length, 0),
);

const badgeMax = 99;

const popoverWidth = 350;

function handleHistory() {
  ElMessage.success(`${activeName.value}`);
}
</script>

<template>
  <div class="notify">
    <el-popover placement="bottom" :width="popoverWidth" trigger="click">
      <template #reference>
        <el-badge
          :value="badgeValue"
          :max="badgeMax"
          :hidden="badgeValue === 0"
        >
          <el-tooltip effect="dark" content="" placement="bottom">
            <el-icon :size="20"><Bell /></el-icon>
          </el-tooltip>
        </el-badge>
      </template>
      <template #default>
        <el-tabs v-model="activeName" class="demo-tabs" stretch>
          <el-tab-pane
            v-for="(item, index) in data"
            :key="index"
            :name="item.name"
          >
            <template #label>
              {{ item.name }}
              <el-badge
                :value="item.list.length"
                :max="badgeMax"
                :type="item.type"
              />
            </template>
            <el-scrollbar height="400px">
              <List :data="item.list" />
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
        <div class="notify-history">
          <el-button link @click="handleHistory">
            {{ activeName }}
          </el-button>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
