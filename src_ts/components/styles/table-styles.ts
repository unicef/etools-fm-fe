import { html, TemplateResult } from 'lit-element';

// language=HTML
export const TableStyles: TemplateResult = html`
    <style>
        .table-title-block {
            position: relative;
            display: flex;
            align-items: center;
            height: 60px;
            padding: 0 10px 0 25px;
        }

        .table-title-block.with-bottom-line { border-bottom: 1px solid #9c9c9c; }
        .table-title-block .table-title {
            flex: auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 18px;
        }

        .table-title-block .buttons-container {
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;

        }

        .table-title-block .panel-button {
            opacity: 0.45;
            transition: 0.15s;
        }

        .table-title-block .panel-button:hover  {
            opacity: 0.57;
        }

        .editable-row {
            position: relative;
        }

        .editable-row .hover-block {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            line-height: 48px;
            background-color: #eeeeee;
            z-index: 100;
        }

        .editable-row .hover-block iron-icon {
            color: rgba(0,0,0,.54);
            padding-left: 5px;
        }

        .editable-row:hover > .hover-block {
            display: block;
            cursor: pointer;
        }

        .col-data {
             height: auto;
             min-height: 47px;
             display: flex;
             align-items: center;
             min-width: 0;
             overflow: hidden;
         }

        .col-data .two-line-truncate {
            height: 38px;
            overflow: hidden;
        }

        .col-data.truncated,
        .col-data .truncate {
            flex-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .col-data .flexible-text {
            display: block;
            margin: 4px 0;
        }

        .row-details-content {
            font-size: 12px;
            padding-right: 100px;
        }

        .row-details-content .rdc-title {
            display: inline-block;
            color: var(--list-secondary-text-color, #757575);
            font-weight: bold;
            margin-bottom: 5px;
        }

        etools-data-table-row {
            --icon-wrapper: { padding: 0 24px; };
            --list-divider-color: #e0e0e0;
            --list-icon-color: rgba(0, 0, 0, 0.54);
        }
        etools-data-table-header {
            --header-title: {
                    padding-left: 47px;
                    font-weight: 500;
            };
            --header-columns: {
                    margin-left: 47px;
                };
            --list-divider-color: 1px solid rgba(244, 243, 242, 0.26);
            --list-bg-color: #f2eee8;
            border-bottom: 1px solid rgba(0, 0, 0, 0.26);
        }
        etools-data-table-footer {
            padding: 5px 0;
        }

        paper-card.table-container {
            padding: 0;
        }

        .remove-title {
            padding: 16px 25px 15px;
            font-size: 17px;
            color: rgba(0, 0, 0, 0.87);
            font-weight: 500;
            line-height: 28px;
        }

        etools-dialog .container {
            padding: 14px;
        }

        etools-dialog {
            --etools-dialog-confirmation-content: {
                        min-height: 0;
                        margin-top: 0;
                        margin-right: 0;
                    };

        --etools-dialog-content: {
                    width: 100%;
                    max-width: 100% !important;

                    overflow-x: hidden;
                    overflow-y: auto;
                    display: block;
                    margin-top: 0;
                };
        }

        paper-textarea {
            overflow: hidden;
        }

        etools-dialog etools-loading { font-size: 14px; }

    </style>
`;
