/*
* The type Constructor<T> is an alias for the construct signature
* that describes a type which can construct objects of the generic type T
* and whose constructor function accepts an arbitrary number of parameters of any type
* On the type level, a class can be represented as a newable function
*/
type Constructor<T> = new(...args: any[]) => T;

type GenericObject<T = any> = {
    [key: string]: T;
};

type TranslateObject = {
    [key: string]: string | TranslateObject;
};

type PageTab = {
    tab: string;
    tabLabel: string;
    hidden: boolean;
};

interface IEtoolsEndpoint {
    url?: string;
    template?: string;
    exp?: any;
    cachingKey?: string;
    cacheTableName?: string;
}

interface IResultEndpoint extends IEtoolsEndpoint {
    url: string;
}

interface IEtoolsEndpoints {
    [key: string]: IEtoolsEndpoint;
}

type Callback = (...args: any) => void;

type RequestMethod = 'POST' | 'PATCH' | 'DELETE' | 'OPTIONS';

type DialogData = {
    title?: string;
    confirm?: string;
    type?: 'add' | 'edit' | 'remove';
    theme?: string;
    opened: boolean;
};

type MarkerDataObj = {
    coords: [number, number];
    staticData?: any;
    popup?: string;
};

type TableInformation = {
    start: number;
    end: number;
    count: number;
};

type EtoolsCategory = {
    id: number;
    name: string;
};

type EtoolsSection = {
    id: string;
    created: string;
    modified: string;
    name: string;
    description: string;
    alternate_id: null | string;
    alternate_name: string;
    dashboard: boolean;
    color: string;
};

type EtoolsMethod = {
    id: number;
    name: string;
};
