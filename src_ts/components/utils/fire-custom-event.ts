export function fireEvent(el: HTMLElement, eventName: string, detail?: any): void {
  el.dispatchEvent(
    new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    })
  );
}
