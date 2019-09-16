import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

@customElement('file-selector')
export class FileSelector extends LitElement {

    @property({ type: String })
    public fileName: string = '';

    @property({ type: String })
    public fileUrl: string = '';

    @query('#file')
    public fileInput!: HTMLInputElement;

    @query('#link')
    public link!: HTMLLinkElement;

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.fileName.trim().length && this.fileUrl.trim().length) {
            this.fileName = this.fileUrl.split('?')[0].split('/').pop() || '';
        }
    }

    public render(): TemplateResult {
        return html`
        <style>
            .file-selector-container {
                display: flex;
                flex-flow: row;
                align-items: center;
            }
            .file-name {
                margin: 0 4px;
                padding: 8px 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .delete-button {
                color: #ea4022;
            }
            .choice-button {
                color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
            }
            .choice-button,
            .download-button {
                min-width: 130px;
            }
            paper-button iron-icon {
                margin-right: 8px;
            }
        </style>
        <div class="file-selector-container">
            <input id="file" hidden type="file" @change="${ () => this.fileSelected()}">
            <a id="link" target="_blank" hidden></a>
            ${ this.fileName.length ? html`<div class="file-name">${ this.fileName }</div>` : ''}
            <paper-button class="choice-button" @tap="${ () => this.selectFile() }">
                <iron-icon icon="file-upload"></iron-icon>
                Choice File
            </paper-button>
            ${ this.fileUrl.length ? html`
                <paper-button class="download-button" @tap="${ () => this.downloadFile() }">
                    <iron-icon icon="cloud-download" class="dw-icon"></iron-icon>
                    Download
                </paper-button>` : '' }
            <paper-button class="delete-button" @tap="${ () => this.deleteFile() }">Delete</paper-button>
        </div>
        `;
    }

    public selectFile(): void {
        this.fileInput.click();
    }

    public downloadFile(): void {
        if (!this.fileUrl || !this.fileUrl.length) { return; }
        this.link.href = this.fileUrl;
        this.link.click();
        window.URL.revokeObjectURL(this.fileUrl);
    }

    public deleteFile(): void {
        this.fileName = '';
        this.fileUrl = '';
        this.dispatchEvent(new CustomEvent('file-deleted', {
            bubbles: true,
            composed: true
        }));
    }

    public fileSelected(): void {
        const fileList: FileList | null = this.fileInput.files;
        if (fileList) {
            const file: File = fileList[0];
            this.fileName = file.name;
            this.fileUrl = '';
            this.dispatchEvent(new CustomEvent('file-selected', {
                detail: file,
                bubbles: true,
                composed: true
            }));
        }
    }
}
