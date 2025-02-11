export function getCssVar(
  varName: string,
  element: HTMLElement = document.documentElement,
) {
  if (!varName?.startsWith("--")) {
    return "";
  }
  return getComputedStyle(element).getPropertyValue(varName);
}

export function setCssVar(
  varName: string,
  value: string,
  element: HTMLElement = document.documentElement,
) {
  if (!varName?.startsWith("--")) {
    return;
  }
  element.style.setProperty(varName, value);
}
