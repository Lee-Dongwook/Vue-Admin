<script lang="ts" setup>
import SwitchRoles from "./components/SwitchRoles.vue";
</script>

<template>
  <div class="app-container">
    <SwitchRoles />
    <el-card shadow="never" class="content"> </el-card>
  </div>
</template>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
}
</style>
