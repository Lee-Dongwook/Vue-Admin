<script lang="ts" setup>
import { useFullscreenLoading } from "@@/composables/useFullscreenLoading";
import { getErrorApi, getSuccessApi } from "./apis/use-fullscreen-loading";

const svg = `
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`;

const options = {
  text: "",
  background: "#F56C6C20",
  svg,
  svgViewBox: "-10, -10, 50, 50",
};

async function querySuccess() {
  const res = await useFullscreenLoading(getSuccessApi)([1, 2, 3]);
  ElMessage.success(`${res.message}，传参为 ${res.data.list.toString()}`);
}

async function queryError() {
  try {
    await useFullscreenLoading(getErrorApi, options)();
  } catch (error) {
    ElMessage.error((error as Error).message);
  }
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never"> </el-card>
    <el-card header="示例" shadow="never">
      <el-button type="primary" @click="querySuccess"> </el-button>
      <el-button type="danger" @click="queryError"> </el-button>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
