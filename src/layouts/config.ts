import { LayoutModeEnum } from "@/common/constants/app-key";
import { getLayoutsConfig } from "@@/utils/cache/local-storage";

export interface LayoutsConfig {
  showSettings: boolean;
  layoutMode: LayoutModeEnum;
  showTagsView: boolean;
  showLogo: boolean;
  fixedHeader: boolean;
  showFooter: boolean;
  showNotify: boolean;
  showThemeSwitch: boolean;
  showScreenfull: boolean;
  showSearchMenu: boolean;
  cacheTagsView: boolean;
  showWatermark: boolean;
  showGreyMode: boolean;
  showColorWeakness: boolean;
}

const DEFAULT_CONFIG: LayoutsConfig = {
  layoutMode: LayoutModeEnum.Left,
  showSettings: true,
  showTagsView: true,
  fixedHeader: true,
  showFooter: true,
  showLogo: true,
  showNotify: true,
  showThemeSwitch: true,
  showScreenfull: true,
  showSearchMenu: true,
  cacheTagsView: false,
  showWatermark: true,
  showGreyMode: false,
  showColorWeakness: false,
};

export const layoutsConfig: LayoutsConfig = {
  ...DEFAULT_CONFIG,
  ...getLayoutsConfig(),
};
