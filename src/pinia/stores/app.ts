import { pinia } from "@/pinia";
import {
  DeviceEnum,
  SIDEBAR_CLOSED,
  SIDEBAR_OPENED,
} from "@/common/constants/app-key";
import {
  getSideBarStatus,
  setSidebarStatus,
} from "@@/utils/cache/local-storage";
