import {
  DeviceEnum,
  SIDEBAR_CLOSED,
  SIDEBAR_OPENED,
} from "@/common/constants/app-key";
import { pinia } from "@/pinia";
import {
  getSideBarStatus,
  setSidebarStatus,
} from "@@/utils/cache/local-storage";

interface Sidebar {
  opened: boolean;
  withoutAnimation: boolean;
}

function handleSidebarStatus(opened: boolean) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED);
}

export const useAppStore = defineStore("app", () => {
  const sidebar: Sidebar = reactive({
    opened: getSideBarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false,
  });

  const device = ref<DeviceEnum>(DeviceEnum.Desktop);

  watch(
    () => sidebar.opened,
    // eslint-disable-next-line style/arrow-parens
    (opened) => handleSidebarStatus(opened),
  );

  const toggleSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = !sidebar.opened;
    sidebar.withoutAnimation = withoutAnimation;
  };

  const closeSidebar = (withoutAnimation: boolean) => {
    sidebar.opened = false;
    sidebar.withoutAnimation = withoutAnimation;
  };

  const toggleDevice = (value: DeviceEnum) => {
    device.value = value;
  };

  return { device, sidebar, toggleSidebar, closeSidebar, toggleDevice };
});

export function useAppStoreOutside() {
  return useAppStore(pinia);
}
