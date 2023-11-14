import {css, html, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, query} from 'lit/decorators.js';
import {translate} from 'lit-translate';
import '@shoelace-style/shoelace/dist/components/button/button.js';
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
          min-width: 130px;
          font-weight: 700;
          padding: 8px 0;
          margin: 0;
        }

        etools-icon {
          margin-right: 8px;
        }
      `
    ];
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <input id="file" hidden type="file" @change="${() => this.fileSelected()}" />
      <sl-button
          class="primary"
          variant="text"
          target="_blank"
          @click="${this.selectFile}"
        >
      <etools-icon name="file-upload" slot="prefix"></etools-icon>
          ${translate('MAIN.UPLOAD')}
      </sl-button>
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
