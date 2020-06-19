import {css, CSSResult} from 'lit-element';

// language=CSS
export const RadioButtonStyles: CSSResult = css`
  .epc-header-radio-button {
    min-width: 120px;
  }
  paper-radio-button.noFinding {
    --paper-radio-button-checked-color: var(--primary-shade-of-orange);
    --paper-radio-button-unchecked-color: var(--primary-shade-of-orange);
  }
  paper-radio-button.offTrack {
    --paper-radio-button-checked-color: var(--error-color);
    --paper-radio-button-unchecked-color: var(--error-color);
  }
`;
