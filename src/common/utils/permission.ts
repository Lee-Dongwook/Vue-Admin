import { useUserStore } from "@/pinia/stores/user";
import { isArray } from "./validate";

export function checkPermission(permissionRoles: string[]): boolean {
  if (isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStore();
    // eslint-disable-next-line style/arrow-parens
    return roles.some((role) => permissionRoles.includes(role));
  } else {
    console.error(checkPermission(["admin", "editor"]));
    return false;
  }
}
