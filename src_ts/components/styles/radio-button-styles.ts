import {css, CSSResult} from 'lit';

// language=CSS
export const RadioButtonStyles: CSSResult = css`
  .epc-header-radio-button {
    min-width: 120px;
  }
  sl-radio.notMonitored {
    --sl-input-border-color: var(--primary-shade-of-orange);
  }
  sl-radio.notMonitored::part(control control--checked) {
    background-color: var(--primary-shade-of-orange);
    border-color: var(--primary-shade-of-orange);
  }

  sl-radio.offTrack {
    --sl-input-border-color: var(--error-color);
  }
  sl-radio.offTrack::part(control control--checked) {
    background-color: var(--error-color);
    border-color: var(--error-color);
  }
`;
