import {css, CSSResult} from 'lit-element';

// language=CSS
export const AttachmentsStyles: CSSResult = css`
  .file-selector-container {
    display: flex;
    flex-flow: row;
    align-items: center;
    padding: 8px 0;
  }
  .filename-container {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--secondary-text-color, rgba(0, 0, 0, 0.54));
    margin: 0 14px;
    min-width: 145px;
    overflow-wrap: break-word;
    font-size: 16px;
  }
  .filename {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-icon {
    width: 24px;
    flex: none;
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }
  .delete-button {
    color: #ea4022;
  }
  .upload-button,
  .download-button {
    color: var(--primary-color);
    min-width: 130px;
  }
  .change-button {
    color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
  }
  iron-icon {
    margin-right: 8px;
  }
  paper-button {
    font-weight: 700;
    margin: 0 0;
    padding: 0 0;
  }
  .file-selector-container.with-type-dropdown {
    padding: 0;
  }
  .file-selector-container.with-type-dropdown etools-dropdown.type-dropdown {
    flex: none;
    width: 209px;
  }
  .file-selector-container.with-type-dropdown .filename-container {
    height: 32px;
    box-sizing: border-box;
    margin: 22px 0 8px;
    border-bottom: 1px solid var(--gray-20);
  }
  .file-selector-container.with-type-dropdown .delete-button,
  .file-selector-container.with-type-dropdown .download-button {
    margin-top: 15px;
  }
  etools-upload-multi.with-padding {
    padding: 12px 9px;
    box-sizing: border-box;
  }
`;
