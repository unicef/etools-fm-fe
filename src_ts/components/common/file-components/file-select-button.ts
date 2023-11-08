import {css, html, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {translate} from 'lit-translate';
import {buttonsStyles} from '@unicef-polymer/etools-unicef/src/styles/button-styles';

@customElement('file-select-button')
export class FileSelectButton extends LitElement {
  @query('#file')
  fileInput!: HTMLInputElement;

  @query('#link')
  link!: HTMLLinkElement;

  static get styles(): CSSResultArray {
    // language=CSS
    return [
      buttonsStyles,
      css`
        .upload-button {
          color: var(--primary-color);
          min-width: 130px;
          font-weight: 700;
          padding: 8px 0;
          margin: 0;
        }

        iron-icon {
          margin-right: 8px;
        }
      `
    ];
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <input id="file" hidden type="file" @change="${() => this.fileSelected()}" />
      <paper-button class="upload-button" @tap="${() => this.selectFile()}">
        <iron-icon icon="file-upload"></iron-icon>
        ${translate('MAIN.UPLOAD')}
      </paper-button>
    `;
  }

  selectFile(): void {
    this.fileInput.click();
  }

  fileSelected(): void {
    const fileList: FileList | null = this.fileInput.files;
    if (fileList) {
      const file: File = fileList[0];
      this.dispatchEvent(
        new CustomEvent('file-selected', {
          detail: file,
          bubbles: true,
          composed: true
        })
      );
    }
  }
}
