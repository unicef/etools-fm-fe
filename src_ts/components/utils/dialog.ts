export interface IDialog<D> {
    dialog: string;
    data?: D;
    readonly?: boolean;
}

export interface IEtoolsDialogResponse {
    confirmed: boolean;
}

export interface IDialogResponse<R> extends IEtoolsDialogResponse {
    response?: R;
}
// you need to fire 'response' event on dialog close!
export function openDialog<D, R = any>({ dialog, data, readonly }: IDialog<D>): Promise<IDialogResponse<R>> {
    return new Promise((resolve: (detail: IDialogResponse<R>) => any, reject: (e: Error) => any) => {
        const dialogElement: HTMLElement & { data: D; readonly?: boolean } =
            document.createElement(dialog) as HTMLElement & { data: D; readonly?: boolean};
        const body: HTMLBodyElement | null = document.querySelector('body');
        if (body) {
            body.appendChild(dialogElement);
        } else {
            reject(new Error('Body not exist'));
        }

        if (data) {
            dialogElement.data = data;
        }
        if (readonly) {
            dialogElement.readonly = readonly;
        }
        dialogElement.addEventListener('response', (e: Event) => {
            const event: CustomEvent<IDialogResponse<R>> = e as CustomEvent<IDialogResponse<R>>;
            resolve(event.detail);
            dialogElement.remove();
        });
    });
}
