const SELECT_RESPONSE_DATA = {
  code: 0,
  data: [
    { label: "", value: 1 },
    { label: "", value: 2 },
    { label: "", value: 3, disabled: true },
  ],
  message: "",
};

const ERROR_MESSAGE = "";

export function getSelectDataApi() {
  return new Promise<typeof SELECT_RESPONSE_DATA>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve(SELECT_RESPONSE_DATA);
      } else {
        reject(new Error(ERROR_MESSAGE));
        ElMessage.error(ERROR_MESSAGE);
      }
    }, 2000);
  });
}
