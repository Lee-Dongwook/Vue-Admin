const SUCCESS_RESPONSE_DATA = {
  code: 0,
  data: {
    list: [] as number[],
  },
  message: "",
};

export function getSuccessApi(list: number[]) {
  return new Promise<typeof SUCCESS_RESPONSE_DATA>((resolve) => {
    setTimeout(() => {
      resolve({ ...SUCCESS_RESPONSE_DATA, data: { list } });
    }, 1000);
  });
}

export function getErrorApi() {
  return new Promise((_resolve, reject) => {
    setTimeout(() => {
      reject(new Error("发生错误"));
    }, 1000);
  });
}
