import { customElement, html, LitElement, query, TemplateResult } from 'lit-element';

@customElement('file-select-button')
export class FileSelectButton extends LitElement {
    @query('#file')
    public fileInput!: HTMLInputElement;

    @query('#link')
    public link!: HTMLLinkElement;

    public render(): TemplateResult {
        return html`
            <style>
                .upload-button {
                    color: var(--primary-color);
                    min-width: 130px;
                    font-weight: 700;
                }
            </style>
            <input id="file" hidden type="file" @change="${ () => this.fileSelected()}">
            <paper-button class="upload-button" @tap="${ () => this.selectFile() }">
                <iron-icon icon="file-upload"></iron-icon>
                Upload File
            </paper-button>
        `;
    }

    public selectFile(): void {
        this.fileInput.click();
    }

    public fileSelected(): void {
        const fileList: FileList | null = this.fileInput.files;
        if (fileList) {
            const file: File = fileList[0];
            this.dispatchEvent(new CustomEvent('file-selected', {
                detail: file,
                bubbles: true,
                composed: true
            }));
        }
    }
}
