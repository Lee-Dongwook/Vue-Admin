<script lang="ts" setup>
import { useWatermark } from "@@/composables/useWaterMark";

const localRef = ref<HTMLElement | null>(null);
const { setWatermark, clearWatermark } = useWatermark(localRef);
const {
  setWatermark: setGlobalWatermark,
  clearWatermark: clearGlobalWatermark,
} = useWatermark();
</script>

<template>
  <div class="app-container">
    <el-card shadow="never"> </el-card>
    <el-card header="示例" shadow="never">
      <div ref="localRef" class="local" />
      <template #footer>
        <el-button-group>
          <el-button
            type="primary"
            @click="setWatermark('', { color: '#409eff' })"
          >
            创建局部水印
          </el-button>
          <el-button
            type="warning"
            @click="
              setWatermark('', {
                color: '#e6a23c',
                defense: false,
              })
            "
          >
          </el-button>
          <el-button type="danger" @click="clearWatermark"> </el-button>
        </el-button-group>
        <el-button-group>
          <el-button
            type="primary"
            @click="setGlobalWatermark('', { color: '#409eff' })"
          >
          </el-button>
          <el-button
            type="warning"
            @click="
              setGlobalWatermark('', {
                color: '#e6a23c',
                defense: false,
              })
            "
          >
          </el-button>
          <el-button type="danger" @click="clearGlobalWatermark"> </el-button>
        </el-button-group>
      </template>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}

.local {
  height: 35vh;
  border: 2px dashed var(--el-color-primary);
}

.el-button-group {
  margin-right: 12px;
  margin-bottom: 5px;
}
</style>
