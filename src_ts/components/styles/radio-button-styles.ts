import {css, CSSResult} from 'lit';

// language=CSS
export const RadioButtonStyles: CSSResult = css`
  .epc-header-radio-button {
    min-width: 120px;
  }
  etools-radio.notMonitored {
    --paper-radio-button-checked-color: var(--primary-shade-of-orange);
    --paper-radio-button-unchecked-color: var(--primary-shade-of-orange);
  }
  etools-radio.offTrack {
    --paper-radio-button-checked-color: var(--error-color);
    --paper-radio-button-unchecked-color: var(--error-color);
  }
`;
