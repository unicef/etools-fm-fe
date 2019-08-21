import { mergeDeepRight, pathOr } from 'ramda';

export const ENGLISH: string = 'en';

const AVAILABLE_LANGUAGES: Set<string> = new Set([ENGLISH]);
const TRANSLATE_BASE: GenericObject<TranslateObject> = {};
let selectedLanguage: string | null = null;

export function addTranslates(language: string, translates: TranslateObject | TranslateObject[]): void {
    if (!translates) { return; }
    if (Array.isArray(translates)) {
        translates.forEach((translateObject: TranslateObject) => addTranslates(language, translateObject));
        return;
    }

    validateLanguage(language);
    if (!validateTranslateObject(translates)) {
        throw new Error('Provided translate object is incorrect. It must be object(nested) with string values');
    }

    const existedTranslates: TranslateObject = TRANSLATE_BASE[language] || {};

    TRANSLATE_BASE[language] = mergeDeepRight(existedTranslates, translates);
}

function validateTranslateObject(translateObject: TranslateObject): boolean {
    if (typeof translateObject !== 'object' || translateObject === null || Array.isArray(translateObject)) {
        return false;
    }
    return Object.values(translateObject).every((value: any) => typeof value === 'string' || validateTranslateObject(value));
}

function validateLanguage(language: string): void | never {
    if (!AVAILABLE_LANGUAGES.has(language)) {
        throw new Error(`Provided language '${language}' is not supported. Please select supported language`);
    }
}

export function useLanguage(language: string): void | never {
    validateLanguage(language);
    selectedLanguage = language;
}

export function translate(path: string, data?: TranslateObject): string {
    if (!selectedLanguage) {
        console.warn('Language is not selected!');
    }
    if (!path || !selectedLanguage) { return ''; }

    const base: TranslateObject = TRANSLATE_BASE[selectedLanguage];
    const result: string = pathOr(path, path.split('.'), base);

    return !data ?
        result :
        Object
            .entries(data)
            .reduce((resultString: string, [key, value]: [string, any]) => {
                return resultString.replace(`<%${key}%>`, value.toString());
            }, result);
}
