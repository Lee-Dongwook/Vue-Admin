<script lang="ts" setup>
import { ElScrollbar } from "element-plus";
import type { RouteRecordName, RouteRecordRaw } from "vue-router";
import { usePermissionStore } from "@/pinia/stores/permission";
import { useDevice } from "@@/composables/useDevice";
import { isExternal } from "@@/utils/validate";
import { cloneDeep, debounce } from "lodash-es";
import Footer from "./Footer.vue";
import Result from "./Result.vue";

const modalValue = defineModel<boolean>({ required: true });

const router = useRouter();
const { isMobile } = useDevice();

const inputRef = ref<HTMLInputElement | null>(null);
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null);
const resultRef = ref<InstanceType<typeof Result> | null>(null);

const keyword = ref<string>("");
const result = shallowRef<RouteRecordRaw[]>([]);
const activeRouteName = ref<RouteRecordName | undefined>(undefined);
const isPressUpOrDown = ref<boolean>(false);

const modalWidth = computed(() => (isMobile.value ? "80vw" : "40vw"));
const menus = computed(() => cloneDeep(usePermissionStore().routes));

const handleSearch = debounce(() => {
  const flatMenus = flatTree(menus.value);
  const _keywords = keyword.value.toLocaleLowerCase().trim();
  result.value = flatMenus.filter((menu) =>
    keyword.value
      ? menu.meta?.title?.toLocaleLowerCase().includes(_keywords)
      : false,
  );

  const length = result.value.length;
  activeRouteName.value = length > 0 ? result.value[0].name : undefined;
}, 500);

function flatTree(arr: RouteRecordName[], result: RouteRecordRaw[] = []) {
  arr.forEach((item: any) => {
    result.push(item);
    item.children && flatTree(item.children, result);
  });

  return result;
}

function handleClose() {
  modalValue.value = false;
  setTimeout(() => {
    keyword.value = "";
    result.value = [];
  }, 200);
}

function scrollTo(index: number) {
  if (!resultRef.value) return;
  const scorllTop = resultRef.value.getScrollTop(index);
  scrollbarRef.value?.setScrollTop(scorllTop);
}

function handleUp() {
  isPressUpOrDown.value = true;
  const { length } = result.value;
  if (length === 0) return;
  const index = result.value.findIndex(
    (item) => item.name === activeRouteName.value,
  );

  if (index === 0) {
    const bottomName = result.value[length - 1].name;
    if (activeRouteName.value === bottomName && length > 1) {
      activeRouteName.value = result.value[length - 2].name;
      scrollTo(length - 2);
    } else {
      activeRouteName.value = bottomName;
      scrollTo(length - 1);
    }
  } else {
    activeRouteName.value = result.value[index - 1].name;
    scrollTo(index - 1);
  }
}

function handleDown() {
  isPressUpOrDown.value = true;
  const { length } = result.value;
  if (length === 0) return;
  const index = result.value
    .map((item) => item.name)
    .lastIndexOf(activeRouteName.value);
  if (index === length - 1) {
    const topName = result.value[0].name;
    if (activeRouteName.value === topName && length > 1) {
      activeRouteName.value = result.value[1].name;
      scrollTo(1);
    } else {
      activeRouteName.value = topName;
      scrollTo(0);
    }
  } else {
    activeRouteName.value = result.value[index + 1].name;
    scrollTo(index + 1);
  }
}

function handleEnter() {
  const { length } = result.value;
  if (length === 0) return;
  const name = activeRouteName.value;
  const path = result.value.find((item) => item.name === name)?.path;
  if (path && isExternal(path))
    return window.open(path, "_blank", "noopener, noreferrer");
  if (!name) return ElMessage.warning("");
  try {
    router.push({ name });
  } catch {
    return ElMessage.warning("");
  }
  handleClose();
}

function handleReleaseUpOrDown() {
  isPressUpOrDown.value = false;
}
</script>

<template>
  <el-dialog
    v-model="modelValue"
    :before-close="handleClose"
    :width="modalWidth"
    top="5vh"
    class="search-modal__private"
    append-to-body
    @opened="inputRef?.focus()"
    @closed="inputRef?.blur()"
    @keydown.up="handleUp"
    @keydown.down="handleDown"
    @keydown.enter="handleEnter"
    @keyup.up.down="handleReleaseUpOrDown"
  >
    <el-input
      ref="inputRef"
      v-model="keyword"
      placeholder=""
      size="large"
      clearable
      @input="handleSearch"
    >
      <template #prefix>
        <SvgIcon name="search" class="svg-icon" />
      </template>
    </el-input>
    <el-empty v-if="result.length === 0" description="" :image-size="100" />
    <template v-else>
      <p></p>
      <el-scrollbar ref="scrollbarRef" max-height="40vh" always>
        <Result
          ref="resultRef"
          v-model="activeRouteName"
          :data="result"
          :is-press-up-or-down="isPressUpOrDown"
          @click="handleEnter"
        />
      </el-scrollbar>
    </template>
    <template #footer>
      <Footer :total="result.length" />
    </template>
  </el-dialog>
</template>

<style lang="scss">
.search-modal__private {
  .svg-icon {
    font-size: 18px;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
    border-top: 1px solid var(--el-border-color);
    padding-top: var(--el-dialog-padding-primary);
  }
}
</style>
