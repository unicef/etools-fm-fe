import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `
  <custom-style>
    <style>
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
        
        --dark-divider-color: rgba(0, 0, 0, 0.12);
        --darker-divider-color: #9D9D9D;
        
        --dark-icon-color: rgba(0, 0, 0, 0.65);
        --light-icon-color: rgba(255, 255, 255, 1);
        
        --side-bar-scrolling: visible;
        
        --success-color: #72c300;
      }
    </style>
  </custom-style>`;

document.head.appendChild(documentContainer.content);
