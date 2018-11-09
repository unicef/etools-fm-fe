type Endpoint = StaticEndpoint | DynamicEndpoint;

type Endpoints = {
    [key: string]: Endpoint
};

type StaticEndpoint = {
    url: string;
    exp?: number;
    cacheTableName?: string;
    template?: string;
};

type DynamicEndpoint = {
    template: string
};

type EndpointTemplateData = {
    [key: string]: string | number
};
