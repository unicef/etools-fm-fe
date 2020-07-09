import {PaperTextareaElement} from '@polymer/paper-input/paper-textarea';
import {IronAutogrowTextareaElement} from '@polymer/iron-autogrow-textarea';

export function setTextareasMaxHeight(textareas: PaperTextareaElement | PaperTextareaElement[]): void {
  const elements: PaperTextareaElement[] = (textareas as PaperTextareaElement[]).length
    ? (textareas as PaperTextareaElement[])
    : ([textareas] as PaperTextareaElement[]);
  elements.forEach((textarea: PaperTextareaElement) => setMaxHeight(textarea));
}

function setMaxHeight(paperTextarea: PaperTextareaElement): void {
  if (!paperTextarea) {
    return;
  }

  const paperInputContainer: HTMLElement | null = paperTextarea.shadowRoot!.querySelector('paper-input-container');
  const textareaAutoGrow: IronAutogrowTextareaElement | null =
    paperInputContainer && paperInputContainer.querySelector('.paper-input-input');

  if (!textareaAutoGrow) {
    return;
  }

  const textareaAutogrowStyles: CSSStyleDeclaration = window.getComputedStyle(textareaAutoGrow, null) || {};
  const maxRows = Number(paperTextarea.getAttribute('max-rows'));

  if (!maxRows || maxRows <= 1) {
    return;
  }

  const lineHeight: string = textareaAutogrowStyles.lineHeight || '';
  const lineHeightPx: number = parseInt(lineHeight, 10);

  if (lineHeightPx) {
    const maxHeight: number = maxRows * lineHeightPx + 5;
    textareaAutoGrow.style.maxHeight = `${maxHeight}px`;
  }
  textareaAutoGrow.textarea.style.overflow = 'auto';
}
