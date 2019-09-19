import { html, TemplateResult } from 'lit-element';

export const SharedStyles: TemplateResult = html`
<style>
  :host {
    display: block;
    box-sizing: border-box;
  }

  *[hidden] {
    display: none !important;
  }

  h1, h2 {
    color: var(--primary-text-color);
    margin: 0;
    font-weight: normal;
  }

  h1 {
    text-transform: capitalize;
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  a {
    color: var(--primary-color);
    text-underline: none;
  }

  section {
    padding: 18px 24px;
    background-color: var(--primary-background-color);
  }

  .toggle-button-control {
                @apply --layout-horizontal;
                @apply --layout-center;
                margin: 0 16px;
                align-self: center;
                padding: 18px 0 18px 10px;
            }

            .toggle-button-control span {
                padding: 0 12px;
                font-size: 16px;
            }

            .toggle-button-control paper-checkbox {
                --paper-checkbox-label: {
                    padding-left: 0;
                }
            }
  .readonly {
                pointer-events: none;
            }

            pages-header-element { box-shadow: 1px -3px 9px 0 #000000; }

            /* TABS */
            paper-tabs {
                --paper-tabs-selection-bar-color: var(--module-primary);
            }

            paper-tab {
                --paper-tab-content: {
                    color: var(--module-primary);
                    text-transform: none;
                    font-size: 14px;
                    font-weight: 500;
                    width: 140px;
                };
                --paper-tab-content-unselected: {
                    color: var(--gray-mid);
                };
            }

            /* PAPER-TOGGLE-BUTTON */
            paper-toggle-button {
                --paper-toggle-button-checked-button-color: var(--module-primary);
                --paper-toggle-button-checked-bar-color: rgba(0,174,239,.5);
                --paper-toggle-button-unchecked-button-color: rgba(241,241,241,1);
                --paper-toggle-button-unchecked-bar-color: rgba(31,31,31,.26);
            }

            /* CHECKBOX */
            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--gray-mid);
                --paper-checkbox-checked-color: var(--module-primary);
                --paper-checkbox-label: {
                    font-size: 17px;
                    padding-left: 15px;
                };
                --paper-checkbox-margin: 0;
                --paper-checkbox-label-color: var(--gray-mid);
            }

             paper-checkbox.nolabel {
                --paper-checkbox-label: {
                    padding-left: 0;
                };
             }

            paper-radio-button {
                --paper-radio-button-unchecked-color: var(--gray-mid);
                --paper-radio-button-checked-color: var(--module-primary);
            }

            etools-dialog[no-padding] {
                --etools-dialog-scrollable: {
                    padding-top: 0!important;
                };
            }

            etools-dialog {
                --etools-dialog-primary-color: var(--module-primary);
                --etools-dialog-scrollable: {
                    margin-top: 0;
                    padding-top: 12px!important;
                };
                --etools-dialog-content: {
                    min-height: 80px;
                    padding-bottom: 8px!important;
                };
                --etools-dialog-button-styles: {
                    margin-top: 0
                };
            }

            etools-dialog > etools-loading {
                margin-bottom: -56px;
            }

            etools-content-panel {
                position: relative;

                --ecp-header-title: {
                    line-height: 48px;
                };

                --ecp-expand-btn: {
                    position: absolute;
                    top: 3px;
                    left: 13px;
                    width: 45px;
                    height: 45px;
                };

                --ecp-header-title: {
                    font-weight: 500;
                    line-height: 48px;
                    padding: 0 30px;
                };

                --ecp-header-btns-wrapper: {
                    opacity: 1;
                };
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

        .filters-section {
            padding: 0 30px;
        }
</style>
`;
