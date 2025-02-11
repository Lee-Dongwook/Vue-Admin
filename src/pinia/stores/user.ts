import { pinia } from "@/pinia";
import { resetRouter } from "@/router";
import { routerConfig } from "@/router/config";
import { getCurrentUserApi } from "@@/apis/users";
import {
  setToken as _setToken,
  getToken,
  removeToken,
} from "@@/utils/cache/cookies";
import { useSettingsStore } from "./settings";
import { useTagsViewStore } from "./tags-view";

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "");
  const roles = ref<string[]>([]);
  const username = ref<string>("");

  const tagsViewStore = useTagsViewStore();
  const settingsStore = useSettingsStore();

  const setToken = async (value: string) => {
    _setToken(value);
    token.value = value;
  };

  const getInfo = async () => {
    const { data } = await getCurrentUserApi();
    username.value = data.username;
    roles.value =
      data.roles?.length > 0 ? data.roles : routerConfig.defaultRoles;
  };

  const changeRoles = async (role: string) => {
    const newToken = `token-${role}`;
    token.value = newToken;
    _setToken(newToken);
    location.reload();
  };

  const logout = () => {
    removeToken();
    token.value = "";
    roles.value = [];
    resetRouter();
    resetTagsView();
  };

  const resetToken = () => {
    removeToken();
    token.value = "";
    roles.value = [];
  };

  const resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews();
      tagsViewStore.delAllCachedViews();
    }
  };

  return {
    token,
    roles,
    username,
    setToken,
    getInfo,
    changeRoles,
    logout,
    resetToken,
  };
});

export function useUserStoreOutside() {
  return useUserStore(pinia);
}
