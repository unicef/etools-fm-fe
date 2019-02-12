export const properties = {
    currentList: {
        type: String,
        value: 'level=0'
    },
    history: {
        type: Array,
        value: () => []
    },
    selectedLocation: {
        type: String,
        notify: true,
        value: null
    },
    selectedSites: {
        type: Array,
        notify: true,
        value: () => []
    },
    widgetLocations: {
        type: Object,
        value: () => ({})
    },
    locationSearch: {
        type: String,
        value: '',
        observer: 'searchChanged'
    },
    listLoading: {
        type: Boolean,
        value: false
    },
    pathLoading: {
        type: Boolean,
        value: false
    },
    loadingInProcess: {
        type: Boolean,
        computed: 'checkLoading(listLoading, pathLoading, mapInitializationProcess)'
    }
};
