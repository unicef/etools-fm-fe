import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';
import '@polymer/paper-styles/element-styles/paper-material-styles';

const documentContainer: any = document.createElement('template');
documentContainer.innerHTML = `
  <custom-style>
    <style include="paper-material-styles">
      html {
        --green-color: #009A54;
        --module-color: #F5A65B;
        --primary-color: #0099ff;
        --primary-background-color: #FFFFFF;
        --secondary-background-color: #eeeeee;

        --primary-text-color: rgba(0, 0, 0, 0.87);
        --secondary-text-color: rgba(0, 0, 0, 0.54);
        --gray-mid: #9d9d9d;

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
        --reject-color: #88304E;
        --note-color: #FF9044;

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

        --ternary-background-color: var(--paper-indigo-800);
        --accent-color: var(--paper-light-blue-a200);
        --dark-primary-text-color: rgba(0, 0, 0, 0.87);
        --light-primary-text-color: rgba(255, 255, 255, 1);
        --dark-secondary-text-color: rgba(0, 0, 0, 0.54);
        --light-secondary-text-color: rgba(255, 255, 255, 0.7);
        --dark-disabled-text-color: rgba(0, 0, 0, 0.38);
        --light-disabled-text-color: rgba(255, 255, 255, 0.5);
        --dark-disabled-icon-color: rgba(0, 0, 0, 0.38);
        --light-disabled-icon-color: rgba(255, 255, 255, 0.5);
        --dark-divider-color: rgba(0, 0, 0, 0.12);
        --dark-hover-color: rgba(0, 0, 0, 0.01);
        --light-hover-color: rgba(255, 255, 255, 0.01);
        --dark-ink-color: rgba(0, 0, 0, 0.3);
        --light-ink-color: rgba(255, 255, 255, 0.30);
        --light-theme-background-color: var(--paper-grey-50);
        --light-theme-content-color: #FFFFFF;
        --dark-theme-background-color: #233944;


        --partnership-management-color: var(--primary-background-color);
        --work-planning-color: var(--paper-light-green-500);
        --field-monitering-color: var(--paper-green-500);

        --title-toolbar-secondary-text-color : #C7CED2;

        --toolbar-height: 60px;

        --gray-06: rgba(0,0,0,.06);
        --gray-08: rgba(0,0,0,.08);
        --gray-lighter: rgba(0,0,0,.12);
        --gray-20: rgba(0,0,0,.20);
        --gray-28: rgba(0,0,0,.28);
        --gray-light: rgba(0,0,0,.38);
        --gray-50: rgba(0,0,0,.50);
        --gray-mid: rgba(0,0,0,.54);
        --gray-mid-dark: rgba(0,0,0,.70);
        --gray-dark: rgba(0,0,0,.87);
        --gray-darkest: #000000;

        --gray-border: rgba(0,0,0,.15);

        /*--module-primary: #00AEEF;*/
        --module-primary: #0099ff;
        /*--module-primary-dark: #4893ff;*/

        --module-sec-blue: #0061e9;
        --module-sec-green: #009a54;
        --module-sec-lightgreen: #72c300;
        --module-sec-gray: #233944;

        --module-error: #EA4022;
        --module-error-2: #f1B8AE;
        --module-warning: #FF9044;
        --module-warning-2: #FFC8a2;
        --module-success: #72c300;
        --module-success-2: #bef078;
        --module-info: #CEBC06;
        --module-info-2: #FFF176;

        --module-planned: rgba(250,237,119,.6);
        --module-approved: rgba(141,198,63,.45);
        --module-submitted: rgba(206,188,6,.6);
        --module-sent: rgba(30,134,191,.45);
        --module-completed: rgba(141,198,63,1);
      }
    </style>
  </custom-style>`;

document.head.appendChild(documentContainer.content);
