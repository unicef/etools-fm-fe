import {CSSResultArray, html, LitElement, TemplateResult} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {AttachmentsStyles} from '../../styles/attachments.styles';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';

import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';

@customElement('file-select-input')
export class FileSelectInput extends LitElement {
  @property({type: String})
  fileId: number | null = null;

  @property({type: String})
  fileName = '';

  @property({type: String})
  fileData?: string | null;

  @property({type: Boolean})
  hasDelete = true;

  @property({type: Boolean})
  isReadonly = false;

  @query('#file')
  fileInput!: HTMLInputElement;

  @query('#link')
  link!: HTMLLinkElement;

  static get styles(): CSSResultArray {
    // language=CSS
    return [AttachmentsStyles];
  }

  get hasFileName(): boolean {
    return !!this.fileName && !!this.fileName.trim().length;
  }

  get hasFileData(): boolean {
    return Boolean(this.fileData) || typeof this.fileData === 'string';
  }

  get isStoredFile(): boolean {
    return Boolean(this.fileId) && typeof this.fileData === 'string';
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <div class="file-selector-container">
        <input id="file" hidden type="file" />
        <a id="link" target="_blank" hidden aria-label="link"></a>
        ${this.hasFileName
          ? html`
              <div class="filename-container">
                <etools-icon class="file-icon" name="attachment"></etools-icon>
                <span class="filename" title="${this.fileName}">${this.fileName}</span>
              </div>
            `
          : ''}
        ${!this.isReadonly
          ? html`
              ${!this.hasFileName
                ? html`
                    <etools-button class="upload-button" variant="text" target="_blank" @click="${this.selectFile}">
                      <etools-icon name="file-upload" slot="prefix"></etools-icon>
                      ${translate('MAIN.UPLOAD')}
                    </etools-button>
                  `
                : ''}
            `
          : ''}
        ${this.isStoredFile
          ? html`
              <etools-button class="download-button" variant="text" target="_blank" @click="${this.downloadFile}">
                <etools-icon name="cloud-download" slot="prefix"></etools-icon>
                ${translate('MAIN.DOWNLOAD')}
              </etools-button>
            `
          : ''}
        ${!this.isReadonly && this.hasDelete
          ? html`
              <etools-button variant="text" class="danger" @click="${() => this.deleteFile()}">
                ${translate('MAIN.BUTTONS.DELETE')}
              </etools-button>
            `
          : ''}
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.fileName) {
      this.fileName = '';
    }
    if (!this.hasFileName && typeof this.fileData === 'string') {
      this.fileName = this.fileData.split('?')[0].split('/').pop() || '';
    }
  }

  selectFile(): void {
    this.fileInput.click();
  }

  downloadFile(): void {
    if (typeof this.fileData === 'string') {
      this.link.href = this.fileData;
      this.link.click();
      window.URL.revokeObjectURL(this.fileData);
    }
  }

  deleteFile(): void {
    this.fileName = '';
    this.fileData = null;
    if (this.fileId) {
      this.dispatchEvent(
        new CustomEvent<Partial<SelectedFile>>('file-deleted', {
          detail: {id: this.fileId},
          bubbles: true,
          composed: true
        })
      );
    }
  }
}
