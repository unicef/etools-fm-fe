export interface IDialog<D> {
    dialog: string;
    data: D;
}

export interface IEtoolsDialogResponse {
    confirmed: boolean;
}

export interface IDialogResponse<R> extends IEtoolsDialogResponse {
    response?: R;
}

export function openDialog<D, R>({ dialog, data }: IDialog<D>): Promise<IDialogResponse<R>> {
    return new Promise((resolve: (detail: IDialogResponse<R>) => any, reject: (e: Error) => any) => {
        const dialogElement: HTMLElement & { data: D } = document.createElement(dialog) as HTMLElement & { data: D };
        const body: HTMLBodyElement | null = document.querySelector('body');
        if (body) {
            body.appendChild(dialogElement);
        } else {
            reject(new Error('Body not exist'));
        }

        dialogElement.data = data;
        dialogElement.addEventListener('response', (e: Event) => {
            const event: CustomEvent<IDialogResponse<R>> = e as CustomEvent<IDialogResponse<R>>;
            resolve(event.detail);
            dialogElement.remove();
        });
    });
}
