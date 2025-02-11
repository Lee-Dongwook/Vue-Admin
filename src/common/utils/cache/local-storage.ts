import type { SidebarClosed, SidebarOpened } from "@/common/constants/app-key";
import type { LayoutsConfig } from "@/layouts/config";
import { CacheKey } from "@/common/constants/cache-key";

export function getLayoutsConfig() {
  const json = localStorage.getItem(CacheKey.CONFIG_LAYOUT);
  return json ? (JSON.parse(json) as LayoutsConfig) : null;
}
