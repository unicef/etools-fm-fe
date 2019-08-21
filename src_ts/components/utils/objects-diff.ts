import { equals } from 'ramda';

function simplifyValue(value: any): any {
    if (Array.isArray(value)) { return value.map((obj: any) => obj && obj.hasOwnProperty('id') && obj.id || obj); }
    if (value && value.hasOwnProperty('id')) { return value.id; }
    return value;
}

export function getDifference<T>(originalData: T, modifiedData: T, toRequest: boolean): T {
    return Object.keys(modifiedData).reduce((changes: T, key: string) => {
        const originalValue: any = originalData[key as keyof T];
        let modifiedValue: any = modifiedData[key as keyof T];
        if (originalValue === null && modifiedValue === null) { return changes; }

        // logic for nested objects ?
        // const isObject: boolean = typeof originalValue === 'object' &&
        //     !Array.isArray(originalValue) &&
        //     !originalValue.id;
        // if (isObject) {
        //     modifiedValue = getDifference(originalValue, modifiedValue);
        //     if (isEmpty(modifiedValue) &&  !isEmpty(originalValue)) { return changes; }
        // }

        let modifiedToCompare: any = modifiedValue;
        let originalToCompare: any = originalValue;
        if (typeof originalValue === 'object' || typeof modifiedValue === 'object') {
            modifiedToCompare = simplifyValue(modifiedValue);
            originalToCompare = simplifyValue(originalValue);
        }
        if (equals(modifiedToCompare, originalToCompare)) { return changes; }
        if (toRequest) { modifiedValue = modifiedToCompare; }
        return { ...changes, [key]: modifiedValue };
    }, {} as T);
}
