import type { Router } from "vue-router";
import { usePermissionStore } from "@/pinia/stores/permission";
import { useUserStore } from "@/pinia/stores/user";
import { routerConfig } from "@/router/config";
import { isWhiteList } from "@/router/whitelist";
import { setRouteChange } from "@@/composables/useRouteListener";
import { useTitle } from "@@/composables/useTitle";
import { getToken } from "@@/utils/cache/cookies";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });
const { setTitle } = useTitle();

export function registerNavigationGuard(router: Router) {
  router.beforeEach(async (to, _from) => {
    NProgress.start();
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    if (!getToken()) {
      if (isWhiteList(to)) return true;
      return "/login";
    }
    if (to.path === "/login") return "/";
    if (userStore.roles.length !== 0) return true;
    try {
      await userStore.getInfo();
      const roles = userStore.roles;
      routerConfig.dynamic
        ? permissionStore.setRoutes(roles)
        : permissionStore.setAllRoutes();
      permissionStore.addRoutes.forEach((route: any) => router.addRoute(route));
      return { ...to, replace: true };
    } catch (error) {
      userStore.resetToken();
      ElMessage.error((error as Error).message || "路由守卫发生错误");
      return "/login";
    }
  });

  router.afterEach((to) => {
    setRouteChange(to);
    setTitle(to.meta.title);
    NProgress.done();
  });
}
