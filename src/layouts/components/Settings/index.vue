<script lang="ts" setup>
import { useSettingsStore } from "@/pinia/stores/settings";
import { useLayoutMode } from "@/common/composables/useLayoutMode";
import { removeLayoutsConfig } from "@/common/utils/cache/local-storage";
import { Refresh } from "@element-plus/icons-vue";
import SelectLayoutMode from "./SelectLayoutMode.vue";

const { isLeft } = useLayoutMode();

const settingsStore = useSettingsStore();

const {
  showTagsView,
  showLogo,
  fixedHeader,
  showFooter,
  showNotify,
  showThemeSwitch,
  showScreenfull,
  showSearchMenu,
  cacheTagsView,
  showWatermark,
  showGreyMode,
  showColorWeakness,
} = storeToRefs(settingsStore);

const switchSettings = {
  "Show Tag View": showTagsView,
  "Show Logo": showLogo,
  "Fixed Header": fixedHeader,
  "Show Footer": showFooter,
  "Show Notify": showNotify,
  "Show Theme Switch": showThemeSwitch,
  "Show Screen Full": showScreenfull,
  "Show Search Menu": showSearchMenu,
  "Cache Tag View": cacheTagsView,
  "Show Water Mark": showWatermark,
  "Show Grey Mode": showGreyMode,
  "Show Color Weakness": showColorWeakness,
};

watchEffect(() => {
  !isLeft.value && (fixedHeader.value = true);
});

function resetLayoutsConfig() {
  removeLayoutsConfig();
  location.reload();
}
</script>

<template>
  <div class="setting-container">
    <h4>Settings</h4>
    <SelectLayoutMode />
    <el-divider />
    <h4></h4>
    <div
      v-for="(settingValue, settingName, index) in switchSettings"
      :key="index"
      class="setting-item"
    >
      <span class="setting-name">{{ settingName }}</span>
      <el-switch
        v-model="settingValue.value"
        :disabled="!isLeft && settingName === 'Fixed Header'"
      />
    </div>
    <el-button type="danger" :icon="Refresh" @click="resetLayoutsConfig">
      Reset
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
@import "@@/assets/styles/mixins.scss";

.setting-container {
  padding: 20px;
  .setting-item {
    font-size: 14px;
    color: var(--el-text-color-regular);
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .setting-name {
      @extend %ellipsis;
    }
  }
  .el-button {
    margin-top: 40px;
    width: 100%;
  }
}
</style>
