const TOOLTIP_FIX_STYLE_ID = 'etools-iit-sl-tooltip-body-height-fix';

const TOOLTIP_HEIGHT_FIX_CSS = `
  sl-tooltip::part(body),
  sl-tooltip .tooltip__body {
    height: auto !important;
    min-height: auto !important;
    max-height: 80vh !important;
    overflow: auto !important;
    display: block !important;
  }
  sl-tooltip::part(popup) {
    height: auto !important;
    min-height: auto !important;
    max-height: 80vh !important;
    overflow: visible !important;
  }
`;

function injectIntoTooltip(el: Element): void {
  const host = el as HTMLElement & {shadowRoot: ShadowRoot};
  const sr = host.shadowRoot;
  if (!sr?.getElementById(TOOLTIP_FIX_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = TOOLTIP_FIX_STYLE_ID;
    style.textContent = TOOLTIP_HEIGHT_FIX_CSS;
    sr.appendChild(style);
  }
}

export function injectInfoTooltipHeightFix(root: DocumentFragment | ShadowRoot | null | undefined): void {
  if (!root?.querySelectorAll) return;
  // Direct descendants (e.g. edit popup)
  root.querySelectorAll('info-icon-tooltip').forEach(injectIntoTooltip);
  // Tooltips inside table rows (slotted content lives in row's light DOM)
  root.querySelectorAll('etools-data-table-row').forEach((row: Element) => {
    row.querySelectorAll('info-icon-tooltip').forEach(injectIntoTooltip);
  });
}
