window.FMMixins = window.FMMixins || {};
window.FMMixins.PermissionController = (superClass: any) => class extends superClass {
    public getReadonlyStatus(collection: IPermissionActions, path: string) {
        return !this.collectionExists(collection, path, 'POST') &&
                !this.collectionExists(collection, path, 'PUT');
    }

    public getPropertyType(collection: IPermissionActions, path: string) {
        return this.getDescriptorFromAll(collection, path, 'type');
    }

    public getRequiredStatus(collection: IPermissionActions, path: string) {
        return this.getDescriptorFromAll(collection, path, 'required');
    }

    public getDescriptorChoices(collection: IPermissionActions, path: string) {
        return this.getDescriptorFromAll(collection, path, 'choices');
    }

    public getDescriptorLabel(collection: IPermissionActions, path: string) {
        return this.getDescriptorFromAll(collection, path, 'label');
    }

    public collectionExists(collection: IPermissionActions, path: string, actionType: ActionTypes) {
        return !!this.getFromCollection(collection,  path, actionType);
    }

    public getFieldDescriptor(
        collection: IPermissionActions,
        path: string,
        attribute: string,
        actionType: ActionTypes
    ) {
        let value: any = this.getFromCollection(collection, path, actionType);
        if (value) { value = value[attribute]; }
        return value === undefined ? null : value;
    }

    public actionAllowed(collection: IPermissionActions, action: string) {
        const actions = collection && collection.allowed_actions;

        return !!~actions
            .map(actionObj => actionObj.code)
            .indexOf(action);
    }

    private getDescriptorFromAll(collection: IPermissionActions, path: string, descriptor: string) {
        return this.getFieldDescriptor(collection, path, descriptor, 'GET') ||
                this.getFieldDescriptor(collection, path, descriptor, 'POST') ||
                this.getFieldDescriptor(collection, path, descriptor, 'PUT');
    }

    private getFromCollection(collection: IPermissionActions, path: string, actionType: ActionTypes) {
        const splitedPath: string[] = path.split('.');
        let value: any = collection;

        while (splitedPath.length) {
            const key = splitedPath.shift() || '';
            if (value[key]) {
                value = value[key];
            } else {
                const action = actionType ?
                    value[actionType] :
                    this.getValidCollection(value.POST) ||
                    this.getValidCollection(value.PUT) ||
                    this.getValidCollection(value.GET);

                value = action || value.child || value.children;
                splitedPath.unshift(key);
            }

            if (!value) { break; }
        }

        return value;
    }

    private getValidCollection(collection: IPermissionActions) {
        return collection && Object.keys(collection).length ? collection : false;
    }

};
