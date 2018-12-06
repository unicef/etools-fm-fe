window.FMMixins = window.FMMixins || {};
window.FMMixins.ProcessDataMixin = (superClass: any) => class extends FMMixins.PermissionController(superClass) {

    public changes(originalData: any, modifiedData: any, permissions: IBackendPermissions, toRequest: boolean = false,
                   pathProperty: string = '') {
        return Object.keys(modifiedData).reduce((changes, key) => {
            const subPath = pathProperty.length === 0 ? key : `${pathProperty}.${key}`;
            const originalValue = originalData[key];
            let modifiedValue = modifiedData[key];
            if (originalValue === null && modifiedValue === null) { return changes; }
            const propertyType = this.getDescriptorType(permissions, subPath);
            if (propertyType === 'nested object') {
                modifiedValue = this.changes(originalData[key], modifiedData[key], permissions, toRequest, subPath);
                if (R.isEmpty(modifiedValue) &&  !R.isEmpty(originalValue)) { return changes; }
            }
            let modifiedToCompare = modifiedValue;
            let originalToCompare = originalValue;
            if (propertyType === 'field') {
                modifiedToCompare = this._simplifyValue(modifiedValue);
                originalToCompare = this._simplifyValue(originalValue);
            }
            if (R.equals(modifiedToCompare, originalToCompare)) { return changes; }
            if (toRequest) { modifiedValue = modifiedToCompare; }
            return { ...changes, [key]: modifiedValue };
        }, {});
    }

    public changesToRequest(originalData: any, modifiedData: any, permissions: IBackendPermissions) {
        return this.changes(originalData, modifiedData, permissions, true);
    }

    public dataToRequest(originalData: any, permissions: IBackendPermissions , pathData: string = '') {
        return Object.keys(originalData).reduce((dataToRequest: any, key) => {
            const subPath = pathData.length === 0 ? key : `${pathData}.${key}`;
            let value = originalData[key];
            const propertyType = this.getDescriptorType(permissions, subPath);
            if (propertyType === 'nested object') {
                value = this.dataToRequest(value, permissions, subPath);
            }
            if (propertyType === 'field') {
                value = this._simplifyValue(value);
            }
            return { ...dataToRequest, [key]: value };
        }, {});
    }

    public _simplifyValue(value: any) {
        if (Array.isArray(value)) { return value.map(obj => obj && obj.hasOwnProperty('id') && obj.id || obj); }
        if (value && value.hasOwnProperty('id')) { return value.id; }
        return value;
    }
};
