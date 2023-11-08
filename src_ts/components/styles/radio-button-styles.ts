import {css, CSSResult} from 'lit';

// language=CSS
export const RadioButtonStyles: CSSResult = css`
  .epc-header-radio-button {
    min-width: 120px;
  }
  paper-radio-button.notMonitored {
    --paper-radio-button-checked-color: var(--primary-shade-of-orange);
    --paper-radio-button-unchecked-color: var(--primary-shade-of-orange);
  }
  paper-radio-button.offTrack {
    --paper-radio-button-checked-color: var(--error-color);
    --paper-radio-button-unchecked-color: var(--error-color);
  }
`;
