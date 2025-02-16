<script lang="ts" setup>
import { useFetchSelect } from "@/common/composables/useFetchSelect";
import { getSelectDataApi } from "./apis/use-fetch-select";

const { loading, options, value } = useFetchSelect({
  api: getSelectDataApi,
});
</script>

<template>
  <div class="app-container">
    <el-card shadow="never"></el-card>
    <el-card header="Select" shadow="never" v-loading="loading">
      <el-select v-model="value" filterable>
        <el-option
          v-for="(item, index) in options"
          v-bind="item"
          :key="index"
          placeholder=""
        />
      </el-select>
    </el-card>
    <el-card header="Select" shadow="never" v-loading="loading">
      <el-select-v2
        v-model="value"
        :options="options"
        filterable
        placeholder=""
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
</style>
