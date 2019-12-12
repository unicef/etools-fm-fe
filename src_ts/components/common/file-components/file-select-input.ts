import {CSSResult, customElement, html, LitElement, property, query, TemplateResult} from 'lit-element';
import {AttachmentsStyles} from '../../styles/attachments.styles';

@customElement('file-select-input')
export class FileSelectInput extends LitElement {
  @property({type: String})
  fileId: number | null = null;

  @property({type: String})
  fileName: string = '';

  @property({type: String})
  fileData?: string | null;

  @property({type: Boolean})
  hasDelete: boolean = true;

  @property({type: Boolean})
  isReadonly: boolean = false;

  @query('#file')
  fileInput!: HTMLInputElement;

  @query('#link')
  link!: HTMLLinkElement;

  static get styles(): CSSResult {
    // language=CSS
    return AttachmentsStyles;
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
        <a id="link" target="_blank" hidden></a>
        ${this.hasFileName
          ? html`
              <div class="filename-container">
                <iron-icon class="file-icon" icon="attachment"></iron-icon>
                <span class="filename" title="${this.fileName}">${this.fileName}</span>
              </div>
            `
          : ''}
        ${!this.isReadonly
          ? html`
              ${!this.hasFileName
                ? html`
                    <paper-button class="upload-button" @tap="${() => this.selectFile()}">
                      <iron-icon icon="file-upload"></iron-icon>
                      Upload File
                    </paper-button>
                  `
                : ''}
            `
          : ''}
        ${this.isStoredFile
          ? html`
              <paper-button class="download-button" @tap="${() => this.downloadFile()}">
                <iron-icon icon="cloud-download" class="dw-icon"></iron-icon>
                Download
              </paper-button>
            `
          : ''}
        ${!this.isReadonly && this.hasDelete
          ? html`
              <paper-button class="delete-button" @tap="${() => this.deleteFile()}">Delete</paper-button>
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
      this.fileName =
        this.fileData
          .split('?')[0]
          .split('/')
          .pop() || '';
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
