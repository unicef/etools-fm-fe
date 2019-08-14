import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import '@polymer/paper-styles/element-styles/paper-material-styles';

const documentContainer: any = document.createElement('template');
documentContainer.innerHTML = `
  <custom-style>
    <style include="paper-material-styles">
      html {
        --primary-color: #0099ff;
        --primary-background-color: #FFFFFF;
        --secondary-background-color: #eeeeee;

        --primary-text-color: rgba(0, 0, 0, 0.87);
        --secondary-text-color: rgba(0, 0, 0, 0.54);

        --header-color: #ffffff;
        --header-bg-color: var(--primary-color);
        --nonprod-header-color: #233944;
        --nonprod-text-warn-color: #e6e600;

        --light-divider-color: rgba(0, 0, 0, 0.12);
        --dark-divider-color: #9D9D9D;

        --dark-icon-color: rgba(0, 0, 0, 0.65);
        --light-icon-color: rgba(255, 255, 255, 1);

        --side-bar-scrolling: visible;

        --success-color: #72c300;
        --error-color: #ea4022;

        --primary-shade-of-green: #1A9251;
        --primary-shade-of-red: #E32526;

        --epc-header: {
          background-color: var( --primary-background-color);
          border-bottom: 1px groove var(--dark-divider-color);
        }
        --epc-header-color: var(--primary-text-color);
        --ecp-header-title: {
          padding: 0 0;
          text-align: left;
        }
        --paper-input-container-label: {
          font-weight: 600;
        }

        --paper-checkbox-checked-color: var(--primary-color);
        --paper-checkbox-unchecked-color: var(--secondary-text-color);
        --paper-radio-button-checked-color: var(--primary-color);
        --paper-radio-button-unchecked-color: var(--secondary-text-color);

        --esmm-external-wrapper: {
          width: 100%;
          margin: 0;
        };
      }
    </style>
  </custom-style>`;

document.head.appendChild(documentContainer.content);
