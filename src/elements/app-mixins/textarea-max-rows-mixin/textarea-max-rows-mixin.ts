window.FMMixins = window.FMMixins || {};
window.FMMixins.TextareaMaxRowsMixin = (superClass: any) => class extends superClass {
    public connectedCallback() {
        super.connectedCallback();
        // @ts-ignore
        Polymer.dom.flush();
        // @ts-ignore
        const paperTextareas = Polymer.dom(this.root).querySelectorAll('paper-textarea') || [];

        paperTextareas.forEach((paperTextarea: HTMLTextAreaElement) => {
            this.setMaxHeight(paperTextarea);
        });
    }

    public setMaxHeight(paperTextarea: HTMLTextAreaElement) {
        if (!paperTextarea) { return false; }

        // @ts-ignore
        const paperInputContainer = Polymer.dom(paperTextarea.root).querySelector('paper-input-container');
        // @ts-ignore
        const textareaAutogrow = Polymer.dom(paperInputContainer).querySelector('.paper-input-input');

        if (!textareaAutogrow) { return false; }

        const textareaAutogrowStyles = window.getComputedStyle(textareaAutogrow, null) || {};
        // @ts-ignore
        const maxRows = +paperTextarea.getAttribute('max-rows');

        if (!maxRows || maxRows <= 1) { return false; }

        this.async(() => {
            const lineHeight = textareaAutogrowStyles.lineHeight || '';
            const lineHeightPx = parseInt(lineHeight, 10);

            if (lineHeightPx) {
                const maxHeight = maxRows * lineHeightPx + 5;
                textareaAutogrow.style.maxHeight = `${maxHeight}px`;
            }
            textareaAutogrow.textarea.style.overflow = 'auto';
        });
        return true;
    }
};