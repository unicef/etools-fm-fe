export const ADD_STATIC_DATA = 'ADD_STATIC_DATA';
export const UPDATE_STATIC_DATA = 'UPDATE_STATIC_DATA';
export const RESET_STATIC_DATA = 'RESET_STATIC_DATA';

export class AddStaticData {
    constructor(name, data) {
        this.type = ADD_STATIC_DATA;
        this.payload = data;
        this.dataName = name;
    }
}

export class UpdateStaticData {
    constructor(name, dataItem) {
        this.type = UPDATE_STATIC_DATA;
        this.payload = dataItem;
        this.dataName = name;
    }
}

export class ResetStaticData {
    constructor(name, data = []) {
        this.type = RESET_STATIC_DATA;
        this.payload = data;
        this.dataName = name;
    }
}