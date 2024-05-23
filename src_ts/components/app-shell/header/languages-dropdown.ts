import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {store} from '../../../redux/store';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';

import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {use} from 'lit-translate';
import {appLanguages} from '../../../config/app-constants';
import {ActiveLanguageSwitched} from '../../../redux/actions/active-language.actions';
import {languageIsAvailableInApp} from '../../utils/utils';
import {updateCurrentUserData} from '../../../redux/effects/user.effects';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {toolbarDropdownStyles} from '@unicef-polymer/etools-unicef/src/styles/toolbar-dropdown-styles';

/**
 * @LitElement
 * @customElement
 */
@customElement('languages-dropdown')
export class LanguagesDropdown extends connect(store)(LitElement) {
  @property({type: Object})
  profile!: IEtoolsUserModel;

  @state()
  selectedLanguage!: string;

  @state()
  initialLanguage!: string;

  @state()
  langUpdateInProgress = false;

  constructor() {
    super();
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${toolbarDropdownStyles}
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown
        transparent
        .selected="${this.selectedLanguage}"
        .options="${appLanguages}"
        option-label="display_name"
        option-value="value"
        @etools-selected-item-changed="${({detail}: CustomEvent) => {
          if (detail.selectedItem) {
            this.languageChanged(detail.selectedItem.value);
          }
        }}"
        trigger-value-change-event
        hide-search
        allow-outside-scroll
        no-label-float
        .disabled="${this.langUpdateInProgress}"
        min-width="120px"
        placement="bottom-end"
        .syncWidth="${false}"
      ></etools-dropdown>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  stateChanged(state: IRootState): void {
    if (state.activeLanguage.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguage) {
      this.selectedLanguage = state.activeLanguage.activeLanguage;
      window.EtoolsLanguage = this.selectedLanguage;
      this.initialLanguage = this.selectedLanguage;
      this.setLanguageDirection();
    }
  }

  private setLanguageDirection() {
    setTimeout(() => {
      const htmlTag = document.querySelector('html');
      if (this.selectedLanguage === 'ar') {
        htmlTag!.setAttribute('dir', 'rtl');
        this.setAttribute('dir', 'rtl');
        this.dir = 'rtl';
      } else if (htmlTag!.getAttribute('dir')) {
        htmlTag!.removeAttribute('dir');
        this.removeAttribute('dir');
        this.dir = '';
      }
    });
  }

  languageChanged(language: string): void {
    use(language).finally(() => store.dispatch(new ActiveLanguageSwitched(language)));

    if (language !== this.selectedLanguage) {
      // Event caught by self translating npm packages
      fireEvent(this, 'language-changed', {language});
    }
    if (
      this.profile &&
      this.profile.preferences?.language != language &&
      this.initialLanguage != language &&
      languageIsAvailableInApp(language)
    ) {
      this.langUpdateInProgress = true;
      store
        .dispatch<AsyncEffect>(updateCurrentUserData({preferences: {language: language}}))
        .catch((err: any) => parseRequestErrorsAndShowAsToastMsgs(err, this))
        .finally(() => (this.langUpdateInProgress = false));
    }
  }
}
