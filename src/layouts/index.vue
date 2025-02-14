<script setup lang="ts">
import { useSettingsStore } from "@/pinia/stores/settings";
import { useDevice } from "@@/composables/useDevice";

const { showSettings } = useSettingsStore();
const { isMobile } = useDevice();
</script>

<template>
  <div>
    <LeftMode v-if="isLeft || isMobile" />
    <TopMode v-else-if="isTop" />
    <LeftTopMode v-else-if="isLeftTop" />
    <RightPanel v-if="showSettings">
      <Settings />
    </RightPanel>
  </div>
</template>
