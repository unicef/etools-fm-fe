class PagesHeader  extends Polymer.Element {
    public static get is() { return 'pages-header'; }

    public static get properties() {
        return {
            title: String,
            tab: {
                type: String,
                notify: true
            },
            tabs: {
                type: Array,
                value: () => []
            }
        };
    }

}

customElements.define(PagesHeader.is, PagesHeader);

// Polymer({
//
//     properties: {
//         title: String,
//         engagement: {
//             type: Object,
//             value: function() {
//                 return {};
//             }
//         },
//         showAddButton: {
//             type: Boolean,
//             value: false
//         },
//         hidePrintButton: {
//             type: Boolean,
//             value: false
//         },
//         data: Object,
//         csvEndpoint: {
//             type: String,
//         },
//         baseUrl: {
//             type: String,
//             value: null
//         },
//         link: {
//             type: String,
//             value: ''
//         },
//         exportLinks: {
//             type: Array,
//             value: []
//         }
//     },
//
//     behaviors: [
//         etoolsAppConfig.globals
//     ],
//
//     attached: function() {
//         this.baseUrl = this.basePath;
//     },
//
//     _hideAddButton: function(show) {
//         return !show;
//     },
//
//     addNewTap: function() {
//         this.fire('add-new-tap');
//     },
//
//     _showLink: function(link) {
//         return !!link;
//     },
//
//     _showBtn: function(link) {
//         return !link;
//     },
//
//     exportData: function(e) {
//         if (this.exportLinks < 1) { throw 'Can not find export link!'; }
//         let url = (e && e.model && e.model.item) ? e.model.item.url : this.exportLinks[0].url;
//         window.open(url, '_blank');
//     },
//
//     _isDropDown: function(exportLinks) {
//         return exportLinks && (exportLinks.length > 1 ||
//             (exportLinks[0] && exportLinks[0].useDropdown));
//     },
//
//     _toggleOpened: function() {
//         this.$.dropdownMenu.select(null);
//     }
// });
