<script lang="ts" setup>
import type { TagView } from "@/pinia/stores/tags-view";
import type {
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
  RouterLink,
} from "vue-router";
import { usePermissionStore } from "@/pinia/stores/permission";
import { useTagsViewStore } from "@/pinia/stores/tags-view";
import { useRouteListener } from "@@/composables/useRouteListener";
import { Close } from "@element-plus/icons-vue";
import path from "path-browserify";
import ScrollPane from "./ScrollPane.vue";

const router = useRouter();

const route = useRoute();

const tagsViewStore = useTagsViewStore();

const permissionStore = usePermissionStore();

const { listenerRouteChange } = useRouteListener();

const tagRefs = ref<InstanceType<typeof RouterLink>[]>([]);

const visible = ref(false);

const top = ref(0);

const left = ref(0);

const selectedTag = ref<TagView>({});

let affixTags: TagView[] = [];

function isActive(tag: TagView) {
  return tag.path === route.path;
}

function isAffix(tag: TagView) {
  return tag.meta?.affix;
}

function filterAffixTags(routes: RouteRecordRaw[], basePath = "/") {
  const tags: TagView[] = [];
  routes.forEach((route) => {
    if (isAffix(route)) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }
    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      tags.push(...childTags);
    }
  });
  return tags;
}

function initTags() {
  affixTags = filterAffixTags(permissionStore.routes);
  for (const tag of affixTags) {
    // 必须含有 name 属性
    tag.name && tagsViewStore.addVisitedView(tag);
  }
}

function addTags(route: RouteLocationNormalizedLoaded) {
  if (route.name) {
    tagsViewStore.addVisitedView(route);
    tagsViewStore.addCachedView(route);
  }
}

function refreshSelectedTag(view: TagView) {
  tagsViewStore.delCachedView(view);
  router.replace({ path: `/redirect${view.path}`, query: view.query });
}

function closeSelectedTag(view: TagView) {
  tagsViewStore.delVisitedView(view);
  tagsViewStore.delCachedView(view);
  isActive(view) && toLastView(tagsViewStore.visitedViews, view);
}

function closeOthersTags() {
  const fullPath = selectedTag.value.fullPath;
  if (fullPath !== route.path && fullPath !== undefined) {
    router.push(fullPath);
  }
  tagsViewStore.delOthersVisitedViews(selectedTag.value);
  tagsViewStore.delOthersCachedViews(selectedTag.value);
}

function closeAllTags(view: TagView) {
  tagsViewStore.delAllVisitedViews();
  tagsViewStore.delAllCachedViews();
  if (affixTags.some((tag) => tag.path === route.path)) return;
  toLastView(tagsViewStore.visitedViews, view);
}

function toLastView(visitedViews: TagView[], view: TagView) {
  const latestView = visitedViews.slice(-1)[0];
  const fullPath = latestView?.fullPath;
  if (fullPath !== undefined) {
    router.push(fullPath);
  } else {
    if (view.name === "Dashboard") {
      router.push({ path: `/redirect${view.path}`, query: view.query });
    } else {
      router.push("/");
    }
  }
}

function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 100;
  const offsetWidth = document.body.offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left15 = e.clientX + 10;
  left.value = left15 > maxLeft ? maxLeft : left15;
  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
}

function closeMenu() {
  visible.value = false;
}

watch(visible, (value) => {
  value
    ? document.body.addEventListener("click", closeMenu)
    : document.body.removeEventListener("click", closeMenu);
});

initTags();

listenerRouteChange((route) => {
  addTags(route);
}, true);
</script>

<template>
  <div class="tags-view-container">
    <ScrollPane class="tags-view-wrapper" :tag-refs="tagRefs">
      <router-link
        v-for="tag in tagsViewStore.visitedViews"
        :key="tag.path"
        ref="tagRefs"
        :class="{ active: isActive(tag) }"
        class="tags-view-item"
        :to="{ path: tag.path, query: tag.query }"
        @click.middle="!isAffix(tag) && closeSelectedTag(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.meta?.title }}
        <el-icon
          v-if="!isAffix(tag)"
          :size="12"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <Close />
        </el-icon>
      </router-link>
    </ScrollPane>
    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: `${left}px`, top: `${top}px` }"
    >
      <li @click="refreshSelectedTag(selectedTag)"></li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      ></li>
      <li @click="closeOthersTags"></li>
      <li @click="closeAllTags(selectedTag)"></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: var(--v3-tagsview-height);
  width: 100%;
  color: var(--v3-tagsview-text-color);
  overflow: hidden;
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--v3-tagsview-tag-border-color);
      border-radius: var(--v3-tagsview-tag-border-radius);
      background-color: var(--v3-tagsview-tag-bg-color);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 5px;
      }
      &:last-of-type {
        margin-right: 5px;
      }
      &.active {
        background-color: var(--v3-tagsview-tag-active-bg-color);
        color: var(--v3-tagsview-tag-active-text-color);
        border-color: var(--v3-tagsview-tag-active-border-color);
      }
      .el-icon {
        margin-left: 5px;
        margin-right: 1px;
        border-radius: 50%;
        &:hover {
          background-color: var(--v3-tagsview-tag-icon-hover-bg-color);
          color: var(--v3-tagsview-tag-icon-hover-color);
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    z-index: 3000;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    color: var(--v3-tagsview-contextmenu-text-color);
    background-color: var(--v3-tagsview-contextmenu-bg-color);
    box-shadow: var(--v3-tagsview-contextmenu-box-shadow);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        color: var(--v3-tagsview-contextmenu-hover-text-color);
        background-color: var(--v3-tagsview-contextmenu-hover-bg-color);
      }
    }
  }
}
</style>
