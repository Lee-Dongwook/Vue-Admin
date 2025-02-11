import type {
  RouteLocationNormalized,
  RouteRecordNameGeneric,
} from "vue-router";

const whiteListByPath: string[] = ["/login"];

const whiteListByName: RouteRecordNameGeneric[] = [];

export function isWhiteList(to: RouteLocationNormalized) {
  return whiteListByPath.includes(to.path) || whiteListByName.includes(to.name);
}
