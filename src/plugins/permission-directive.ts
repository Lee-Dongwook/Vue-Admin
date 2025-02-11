import type { App, Directive } from "vue";
import { useUserStore } from "@/pinia/stores/user";
import { isArray } from "@/common/utils/validate";

const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding;
    const { roles } = useUserStore();
    if (isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = roles.some((role) =>
        permissionRoles.includes(role),
      );

      hasPermission || el.parentNode?.removeChild(el);
    } else {
      throw new Error("");
    }
  },
};

export function installPermissionDirective(app: App) {
  app.directive("permission", permission);
}
