function initStarNotification() {
  setTimeout(() => {
    ElNotification({
      title: "",
      type: "success",
      message: h("div", null, [
        h("div", null, ""),
        h("a", {
          style: "color:teal",
          target: "_blank",
          href: "https://github.com/un-pany/v3-admin-vite",
        }),
      ]),
      duration: 0,
      position: "bottom-right",
    });
  }, 0);
}

function initStoreNotification() {
  setTimeout(() => {
    ElNotification({
      title: "",
      type: "warning",
      message: h("div", null, [
        h("div", null, ""),
        h("a", {
          style: "color: teal",
          target: "_blank",
          href: "https://github.com/un-pany/v3-admin-vite/issues/225",
        }),
      ]),
      duration: 0,
      position: "bottom-right",
    });
  }, 500);
}

export function usePany() {
  return { initStarNotification, initStoreNotification };
}
