window.FMMixins = window.FMMixins || {};
window.FMMixins.CommonMethods = (superClass: any) => class extends FMMixins.PermissionController(superClass) {
    public getPlaceholder(permissions: IPermissionActions, path: string, prefix: string) {
        const isReadonly = this.getReadonlyStatus(permissions, path);
        const label = this.getDescriptorLabel(permissions, path);
        return isReadonly ? 'Empty Field' : `${prefix} ${label}`;
    }

    public resetInputs() {
        const elements = this.shadowRoot.querySelectorAll('.validate-input');
        for (const element of elements) {
            element.invalid = false;
            element.value = '';
        }
    }
};