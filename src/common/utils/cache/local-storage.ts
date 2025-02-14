import type { SidebarClosed, SidebarOpened } from "@/common/constants/app-key";
import type { LayoutsConfig } from "@/layouts/config";
import type { TagView } from "@/pinia/stores/tags-view";
import type { ThemeName } from "@@/composables/useTheme";
import { CacheKey } from "@/common/constants/cache-key";

export function getLayoutsConfig() {
  const json = localStorage.getItem(CacheKey.CONFIG_LAYOUT);
  return json ? (JSON.parse(json) as LayoutsConfig) : null;
}

export function setLayoutsConfig(settings: LayoutsConfig) {
  localStorage.setItem(CacheKey.CONFIG_LAYOUT, JSON.stringify(settings));
}

export function removeLayoutsConfig() {
  localStorage.removeItem(CacheKey.CONFIG_LAYOUT);
}

export function getSidebarStatus() {
  return localStorage.getItem(CacheKey.SIDEBAR_STATUS);
}

export function setSidebarStatus(sidebarStatus: SidebarOpened | SidebarClosed) {
  localStorage.setItem(CacheKey.SIDEBAR_STATUS, sidebarStatus);
}

export function getActiveThemeName() {
  return localStorage.getItem(CacheKey.ACTIVE_THEME_NAME) as ThemeName | null;
}
export function setActiveThemeName(themeName: ThemeName) {
  localStorage.setItem(CacheKey.ACTIVE_THEME_NAME, themeName);
}

export function getVisitedViews() {
  const json = localStorage.getItem(CacheKey.VISITED_VIEWS);
  return JSON.parse(json ?? "[]") as TagView[];
}

export function setVisitedViews(views: TagView[]) {
  views.forEach((view) => {
    delete view.matched;
    delete view.redirectedFrom;
  });
  localStorage.setItem(CacheKey.VISITED_VIEWS, JSON.stringify(views));
}

export function getCachedViews() {
  const json = localStorage.getItem(CacheKey.CACHED_VIEWS);
  return JSON.parse(json ?? "[]") as string[];
}

export function setCachedViews(views: string[]) {
  localStorage.setItem(CacheKey.CACHED_VIEWS, JSON.stringify(views));
}
