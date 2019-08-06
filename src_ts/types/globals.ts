/*
* The type Constructor<T> is an alias for the construct signature
* that describes a type which can construct objects of the generic type T
* and whose constructor function accepts an arbitrary number of parameters of any type
* On the type level, a class can be represented as a newable function
*/
type Constructor<T> = new(...args: any[]) => T;

type GenericObject = {
    [key: string]: any;
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
interface IEtoolsEndpoints {
    [key: string]: IEtoolsEndpoint;
}

type Callback = (...args: any) => void;
