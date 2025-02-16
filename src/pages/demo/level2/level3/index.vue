<script lang="ts" setup>
defineOptions({
  name: "Level3",
});

const text = ref("");
</script>

<template>
  <div class="app-container">
    <el-card header="">
      <el-input v-model="text" placeholder="" />
    </el-card>
  </div>
</template>
