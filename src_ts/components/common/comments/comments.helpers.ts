export function removeTrailingIds(key: string): string {
  return key.replace(/(-\d+)+$/, '');
}

export function extractId(key: string): string {
  return key.substring(key.lastIndexOf('-') + 1);
}

export function fitCommentsToWindow() {
  const elem = document.querySelector('comments-panels') as any;
  if (!elem) {
    return;
  }

  const panelOpened = elem.shadowRoot?.querySelector('messages-panel')?.classList.contains('opened');

  let y = elem.offsetTop;
  let x = elem.offsetLeft;
  const scrollbarOffsetRight = window.innerWidth < 890 ? 0 : 18;

  if (x < (panelOpened && window.innerWidth < 890 ? elem.clientWidth - scrollbarOffsetRight - 10 : 0)) {
    x = panelOpened && window.innerWidth < 890 ? elem.clientWidth - scrollbarOffsetRight - 10 : 0;
  }
  if (y < 0) y = 0;
  if (x > window.innerWidth - elem.clientWidth - scrollbarOffsetRight) {
    x = window.innerWidth - elem.clientWidth - scrollbarOffsetRight;
  }
  if (y > window.innerHeight - elem.clientHeight) y = window.innerHeight - elem.clientHeight;

  elem.style.top = y + 'px';
  elem.style.left = x + 'px';
}

export function makeCommentsDraggable(e: any) {
  e = (e.touches && e.touches[0]) || e || window.event;
  // get the mouse cursor position at startup:
  const elem = document.querySelector('comments-panels') as any;
  if (!elem) {
    return;
  }

  const panelOpened = elem.shadowRoot?.querySelector('messages-panel')?.classList.contains('opened');
  const initX = elem.offsetLeft;
  const initY = elem.offsetTop;
  const firstX = e.clientX;
  const firstY = e.clientY;

  document.addEventListener('mouseup', closeDragElement, true);
  document.addEventListener('mousemove', elementDrag, true);
  document.addEventListener('touchend', closeDragElement, true);
  document.addEventListener('touchmove', elementDrag, true);

  function closeDragElement() {
    document.removeEventListener('mouseup', closeDragElement, true);
    document.removeEventListener('mousemove', elementDrag, true);
    document.removeEventListener('touchend', closeDragElement, true);
    document.removeEventListener('touchmove', elementDrag, true);
  }

  function elementDrag(e: any) {
    e = (e.touches && e.touches[0]) || e || window.event;

    let y = initY + e.clientY - firstY;
    let x = initX + e.clientX - firstX;

    const scrollbarOffsetRight = window.innerWidth < 890 ? 0 : 18;

    if (x < (panelOpened && window.innerWidth > 889 ? elem.clientWidth - scrollbarOffsetRight - 10 : 0)) {
      x = panelOpened && window.innerWidth > 889 ? elem.clientWidth - scrollbarOffsetRight - 10 : 0;
    }
    if (y < 0) y = 0;
    if (x > window.innerWidth - elem.clientWidth - scrollbarOffsetRight) {
      x = window.innerWidth - elem.clientWidth - scrollbarOffsetRight;
    }
    if (y > window.innerHeight - elem.clientHeight) y = window.innerHeight - elem.clientHeight;

    elem.style.top = y + 'px';
    elem.style.left = x + 'px';
  }
}
