<script setup lang="ts">
import { sr } from "element-plus/es/locales.mjs";
import screenfull from "screenfull";

interface Props {
  element?: string;
  openTips?: string;
  exitTips?: string;
  content?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  element: "html",
  openTips: "Open",
  exitTips: "Exit",
  content: false,
});

const CONTENT_LARGE = "content-large";
const CONTENT_FULL = "content-full";

const classList = document.body.classList;

const isEnabled = screenfull.isEnabled;
const isFullscreen = ref<boolean>(false);
const fullscreenTips = computed(() =>
  isFullscreen.value ? props.exitTips : props.openTips,
);
const fullscreenSvgName = computed(() =>
  isFullscreen.value ? "fullscreen-exit" : "fullscreen",
);

function handleFullscreenClick() {
  const dom = document.querySelector(props.element) || undefined;
  isEnabled ? screenfull.toggle(dom) : ElMessage.warning("");
}

function handleFullScreenChange() {
  isFullscreen.value = screenfull.isFullscreen;
  isFullscreen.value || classList.remove(CONTENT_LARGE, CONTENT_FULL);
}

watchEffect((onCleanup) => {
  if (isEnabled) {
    screenfull.on("change", handleFullScreenChange);
    onCleanup(() => {
      screenfull.off("change", handleFullScreenChange);
    });
  }
});

const isContentLarge = ref<boolean>(false);
const contentLargeTips = computed(() => (isContentLarge.value ? "" : ""));
const contentLargeSvgName = computed(() =>
  isContentLarge.value ? "fullscreen-exit" : "fullscreen",
);

function handleContentLargeClick() {
  isContentLarge.value = !isContentLarge.value;
  classList.toggle(CONTENT_LARGE, isContentLarge.value);
}

function handleContentFullClick() {
  isContentLarge.value && handleContentLargeClick();
  classList.add(CONTENT_FULL);
  handleFullscreenClick();
}
</script>

<template>
  <div>
    <el-tooltip
      v-if="!props.content"
      effect="dark"
      :content="fullscreenTips"
      placement="bottom"
    >
      <SvgIcon
        :name="fullscreenSvgName"
        @click="handleFullscreenClick"
        class="svg-icon"
      />
    </el-tooltip>
    <el-dropdown v-else :disabled="isFullscreen">
      <SvgIcon :name="contentLargeSvgName" class="svg-icon" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleContentLargeClick">
            {{ contentLargeTips }}
          </el-dropdown-item>
          <el-dropdown-item @click="handleContentFullClick">
            Click
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.svg-icon {
  font-size: 20px;
  &:focus {
    outline: none;
  }
}
</style>
