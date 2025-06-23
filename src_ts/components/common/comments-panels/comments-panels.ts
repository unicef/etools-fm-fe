import {LitElement, html, TemplateResult, CSSResultArray, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './comments-list/comments-list';
import './messages-panel/messages-panel';
import {CommentPanelsStyles} from './common-comments.styles';
import {CommentsCollection, CommentType} from '../comments/comments.reducer';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {CommentItemData, CommentRelatedItem, CommentsEndpoints} from '../comments/comments-types';
import {buildUrlQueryString} from '@unicef-polymer/etools-utils/dist/general.util';
import {ComponentsPosition} from '../comments/comments-items-name-map';
import {removeTrailingIds} from '../comments/comments.helpers';
// import {ExpectedResult, ResultLinkLowerResult} from '@unicef-polymer/etools-types';
// import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
// import {getEndpoint} from '@unicef-polymer/etools-utils/dist/endpoint.util';
// import {etoolsEndpoints} from '../../../endpoints/endpoints-list';
import {store} from '../../../redux/store';

@customElement('comments-panels')
export class CommentsPanels extends connect(store)(LitElement) {
  @property() messagesOpened = false;
  @property() commentsCollection?: CommentsCollection;
  @property() comments: CommentType[] = [];
  @property() minimized = false;

  collectionId?: number;
  endpoints?: CommentsEndpoints;
  openedCollection: CommentItemData | null = null;
  relatedItems?: CommentRelatedItem[] = [];

  protected render(): TemplateResult {
    return html`
      <comments-list
        @show-messages="${(event: CustomEvent) => this.openCollection(event.detail.commentsGroup)}"
        @close-comments-panels="${this.closePanels}"
        @toggle-minimize="${this.toggleMinimize}"
        .selectedGroup="${this.openedCollection?.relatedTo}"
        .commentsCollection="${this.commentsCollection}"
        .relatedItems="${this.relatedItems}"
      ></comments-list>
      <messages-panel
        class="${this.openedCollection ? 'opened' : ''}"
        .relatedItem="${this.openedCollection?.relatedItem}"
        .relatedTo="${this.openedCollection?.relatedTo}"
        .relatedToKey="${this.openedCollection?.relatedToTranslateKey}"
        .relatedToDescription="${this.openedCollection?.relatedToDescription}"
        .comments="${this.comments}"
        .collectionId="${this.collectionId}"
        .endpoints="${this.endpoints}"
        @hide-messages="${() => this.closeCollection()}"
      ></messages-panel>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.closeCollection();
  }

  mapToOpjectType(array: any[], type: string): CommentRelatedItem[] {
    return array.map(({id, code, name, indicator}: any) => ({
      type,
      id: indicator?.id || id,
      name: indicator?.title || name,
      code: indicator?.code || code
    }));
  }

  getCurrentCollectionId() {
    return store.getState().activityDetails?.data?.id || null;
  }

  stateChanged(state: IRootState): void {
    const commentsState = state.commentsData;
    // TODO: Get dynamically what param or object we should use
    const currentCollectionId = this.getCurrentCollectionId();
    if (!commentsState || !currentCollectionId) {
      return;
    }

    this.collectionId = currentCollectionId;
    this.endpoints = state.commentsData.endpoints;
    const {collection} = commentsState;
    this.commentsCollection = {...(collection[currentCollectionId] || {})};
    if (this.openedCollection) {
      this.comments = [...this.commentsCollection![this.openedCollection.relatedTo]];
    }

    // Request result link in order to obtain the new title and the section code
    // in order to display inside comments list and inside dialog title
    const collectionItem = state.activityDetails.data;
    if (collectionItem) {
      // Add if needed. Left below for inspiration
      this.relatedItems = [];
      // sendRequest({
      //   endpoint: getEndpoint(etoolsEndpoints.resultLinksDetails, {id: collectionItem.id})
      // }).then((response: any) => {
      //   const pds = response?.result_links.map(({ll_results: pds}: ExpectedResult) => pds).flat();
      //   const activities = pds.map(({activities}: ResultLinkLowerResult) => activities).flat();
      //   this.relatedItems = [
      //     ...this.mapToOpjectType(pds, 'pd-output'),
      //     ...this.mapToOpjectType(activities, 'activity')
      //   ];
      //   this.requestUpdate();
      // });
    }
  }

  openCollection(commentsGroup: CommentItemData) {
    this.openedCollection = commentsGroup;
    this.comments = [...this.commentsCollection![this.openedCollection.relatedTo]];
    const relatedToKey: string = removeTrailingIds(this.openedCollection.relatedTo);
    const expectedTab: string = ComponentsPosition[relatedToKey];
    const path = `activities/${this.collectionId}/${expectedTab}${location.search}`;
    history.pushState(window.history.state, '', path);
    window.dispatchEvent(new CustomEvent('popstate'));
    this.slideToRight();
  }

  // Will slide comments list panel to right if not enough
  // space on the left side to open the message panel.
  slideToRight() {
    // Disable slide for screens with width less then 880px
    if (window.innerWidth < 880) {
      return;
    }

    const messagePanelWidth = 440;
    const pixelsToMove = 15;

    if (this.offsetLeft >= messagePanelWidth) {
      return;
    }

    let left = this.offsetLeft;
    const animationInterval = setInterval(() => {
      left += pixelsToMove;
      if (left >= messagePanelWidth) {
        left = messagePanelWidth;
      }
      this.style.left = left + 'px';

      if (left == messagePanelWidth) {
        clearInterval(animationInterval);
      }
    }, 0);
  }

  closeCollection(): void {
    this.openedCollection = null;
    this.comments = [];
  }

  closePanels(): void {
    const routeDetails = store.getState().app.routeDetails;
    const queryParams = {...(routeDetails!.queryParams || {})};
    delete queryParams['comment_mode'];
    const stringParams: string = buildUrlQueryString(queryParams);
    const path: string = routeDetails!.path + (stringParams !== '' ? `?${stringParams}` : '');
    history.pushState(window.history.state, '', path);
    window.dispatchEvent(new CustomEvent('popstate'));
  }

  toggleMinimize(): void {
    this.minimized = !this.minimized;
    if (this.minimized) {
      this.dataset.minimized = '';
      this.closeCollection();
    } else {
      delete this.dataset.minimized;
    }
  }

  static get styles(): CSSResultArray {
    // language=css
    return [
      CommentPanelsStyles,
      css`
        :host {
          display: block;
          position: fixed;
          top: 150px;
          right: 18px;
          z-index: 99;
          width: calc(100% - 36px);
          height: 550px;
          max-height: calc(100vh - 150px);
          max-width: 450px;
        }

        :host([data-minimized]),
        :host([data-minimized]) messages-panel,
        :host([data-minimized]) comments-list {
          height: 64px;
        }
      `
    ];
  }
}
