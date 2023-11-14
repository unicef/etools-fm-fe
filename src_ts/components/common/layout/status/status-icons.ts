import {html, TemplateResult} from 'lit';

/* eslint-disable max-len */
export const completedStatusIcon: TemplateResult = html`
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    style="pointer-events: none; display: block; width: 100%; height: 100%; padding: 2px; box-sizing: border-box;"
  >
    <g>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
    </g>
  </svg>
`;

export const cancelledStatusIcon: TemplateResult = html`
  <svg
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    focusable="false"
    style="pointer-events: none; display: block; width: 100%; height: 100%;"
  >
    <g>
      <path
        d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
      ></path>
    </g>
  </svg>
`;
