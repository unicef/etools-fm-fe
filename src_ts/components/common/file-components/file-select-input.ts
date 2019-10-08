import { css, CSSResult, customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';

export type SelectedFile = {
    id?: number;
    file?: File;
};

@customElement('file-select-input')
export class FileSelectInput extends LitElement {

    @property({ type: String })
    public fileId: number | null = null;

    @property({ type: String })
    public fileName: string = '';

    @property({ type: String })
    public fileData?: string | File | null;

    @property({ type: Boolean })
    public hasDelete: boolean = true;

    @property({ type: Boolean })
    public isReadonly: boolean = false;

    @query('#file')
    public fileInput!: HTMLInputElement;

    @query('#link')
    public link!: HTMLLinkElement;

    public static get styles(): CSSResult {
        // language=CSS
        return css`
            .file-selector-container {
                display: flex;
                flex-flow: row;
                align-items: center;
                padding: 8px 0;
            }
            .filename-container {
                @apply --layout-horizontal;
                @apply --layout-center;
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
        `;
    }

    public render(): TemplateResult {
        // language=HTML
        return html`
        <div class="file-selector-container">
            <input id="file" hidden type="file" @change="${ () => this.fileSelected()}">
            <a id="link" target="_blank" hidden></a>
            ${ this.hasFileName ?
            html`
                <div class="filename-container">
                    <iron-icon class="file-icon" icon="attachment"></iron-icon>
                    <span class="filename" title="${ this.fileName }">${ this.fileName }</span>
                </div>` :
                ''}
            ${ this.isReadonly ? '' : html`
                ${ this.hasFileName ?
                html`
                    <paper-button class="change-button" @tap="${ () => this.selectFile() }">Change</paper-button>` :
                html`
                    <paper-button class="upload-button" @tap="${ () => this.selectFile() }">
                        <iron-icon icon="file-upload"></iron-icon>
                        Upload File
                    </paper-button>` }
            ` }
            ${ this.isStoredFile ?
            html`
                <paper-button class="download-button" @tap="${ () => this.downloadFile() }">
                    <iron-icon icon="cloud-download" class="dw-icon"></iron-icon>
                    Download
                </paper-button>` :
                '' }
            ${ !this.isReadonly && this.hasFileData && this.hasDelete ?
            html`
                <paper-button class="delete-button" @tap="${ () => this.deleteFile() }">Delete</paper-button>` :
            ''}
        </div>
        `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.fileName) { this.fileName = ''; }
        if (!this.hasFileName && typeof this.fileData === 'string') {
            this.fileName = this.fileData.split('?')[0].split('/').pop() || '';
        }
    }

    public selectFile(): void {
        this.fileInput.click();
    }

    public downloadFile(): void {
        if (typeof this.fileData === 'string') {
            this.link.href = this.fileData;
            this.link.click();
            window.URL.revokeObjectURL(this.fileData);
        }
    }

    public get hasFileName(): boolean {
        return !!this.fileName && !!this.fileName.trim().length;
    }

    public get hasFileData(): boolean {
        return Boolean(this.fileData) || typeof this.fileData === 'string';
    }

    public get isStoredFile(): boolean {
        return Boolean(this.fileId) && typeof this.fileData === 'string';
    }

    public fileSelected(): void {
        const fileList: FileList | null = this.fileInput.files;
        if (fileList && fileList.length) {
            const file: File = fileList[0];
            this.fileName = file.name;
            this.fileData = file;
            const detail: SelectedFile = this.fileId ? { id: this.fileId, file } : { file };
            this.dispatchEvent(new CustomEvent<SelectedFile>('file-selected', {
                detail,
                bubbles: true,
                composed: true
            }));
        }
    }

    public deleteFile(): void {
        this.fileName = '';
        this.fileData = null;
        if (this.fileId) {
            this.dispatchEvent(new CustomEvent<SelectedFile>('file-deleted', {
                detail: { id: this.fileId },
                bubbles: true,
                composed: true
            }));
        }
    }
}
