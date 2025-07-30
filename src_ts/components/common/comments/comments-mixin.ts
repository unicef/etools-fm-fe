import {LitElement} from 'lit';
import {CommentsCollection, CommentType} from './comments.reducer';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import './comments-dialog';
import '../comments-panels/comments-panels';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {Constructor} from '@unicef-polymer/etools-types';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {store} from '../../../redux/store';

type MetaData = CommentElementMeta & {
  oldStyles: string;
  counter: HTMLElement;
  overlay: HTMLElement;
};

export type CommentElementMeta = {
  relatedTo: string;
  relatedToDescription: string;
  element: HTMLElement;
};
/**
 * - !CommentsMixin uses connect mixin, so don't use it in your component!
 * - !If you use stateChanged inside your component remember to call super.stateChanged() at the end of your method!
 * - !For the firstUpdated method all is the same as for stateChanged!
 *
 * Use several attributes:
 *
 * [comment-element] - this element will be used as base element for comments. Provided string inside attribute will be
 * used as relatedTo field for comments
 *
 * [comment-description] - attribute value will be used for Comment Popup title
 *
 * [comments-container] - provide this attribute if you need special logic for base element. In this case you need to
 * implement getSpecialElement() method that will take base element as argument;
 * This method must return array of  that will be used as Base element for comments
 *
 * @param baseClass
 * @constructor
 */
export function CommentsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  return class CommentsMixin extends connect(store)(baseClass) {
    get commentMode(): boolean {
      return this.commentsModeEnabled;
    }

    private currentCollectionId: number | null = null;
    private comments: CommentsCollection = {};
    private metaDataCollection: MetaData[] = [];
    private commentsModeEnabled = false;
    private currentEditedComments: MetaData | null = null;
    commentsModeInitialize = true;

    // Overwrite this method where needed
    getCurrentCollectionId() {
      return store.getState().activityDetails?.data?.id || null;
    }

    stateChanged(state: IRootState) {
      const commentsState = state.commentsData;
      this.currentCollectionId = this.getCurrentCollectionId();

      if (!commentsState || !this.currentCollectionId) {
        return;
      }

      const {commentsModeEnabled, collection} = commentsState;
      const needToUpdate =
        this.commentsModeEnabled &&
        Object.entries(collection[this.currentCollectionId] || {}).some(
          ([relatedTo, comments]) => comments !== this.comments[relatedTo]
        );
      this.comments = {...(collection[this.currentCollectionId] || {})};

      if (needToUpdate) {
        // we need to update comments state if mode was enabled before the data was fetched
        this.metaDataCollection.forEach((meta: MetaData) => {
          this.updateCounter(meta);
          this.updateBorderColor(meta);
        });
      }

      // update sate for currently edited comments
      if (this.currentEditedComments) {
        this.updateCounter(this.currentEditedComments);
        this.updateBorderColor(this.currentEditedComments);
      }

      if (commentsModeEnabled !== this.commentsModeEnabled) {
        this.commentsModeEnabled = commentsModeEnabled;
        this.setCommentMode();
        fireEvent(this, 'scroll-up');
      }
    }

    /**
     * Implement this method inside your component if you want to use comments-container attribute
     * @param _ - base element
     */
    getSpecialElements(_: HTMLElement): CommentElementMeta[] {
      return [];
    }

    async setCommentMode() {
      if (!this.commentsModeInitialize) {
        this.commentsModeInitialize = true;
        return;
      }

      await this.updateComplete;
      if (this.commentsModeEnabled) {
        this.startCommentMode();
      } else {
        this.stopCommentMode();
      }
      (this as any).requestUpdate();
    }

    private startCommentMode(): void {
      const elements: NodeListOf<HTMLElement> = this.shadowRoot!.querySelectorAll(
        '[comment-element], [comments-container]'
      );
      this.metaDataCollection = Array.from(elements)
        .filter((element) => !!element)
        .map((element: HTMLElement) => {
          if (element.hasAttribute('comments-container')) {
            return this.getMetaFromContainer(element);
          }
          const relatedTo: string | null = element.getAttribute('comment-element');
          const relatedToDescription = element.getAttribute('comment-description') || '';
          return !relatedTo ? null : this.createMataData(element, relatedTo, relatedToDescription as string);
        })
        .flat()
        .filter((meta: MetaData | null) => meta !== null) as MetaData[];
      this.metaDataCollection.forEach((meta: MetaData) => {
        this.updateCounter(meta);
        this.registerListener(meta);
      });
    }

    private stopCommentMode(): void {
      while (this.metaDataCollection.length) {
        const meta: MetaData = this.metaDataCollection.shift() as MetaData;
        meta.element.style.cssText = meta.oldStyles;
        meta.counter.remove();
        meta.overlay.remove();

        this.revertDisableTabNavigationOnRelativeElements(meta.element);
      }
    }

    private createMataData(element: HTMLElement, relatedTo: string, relatedToDescription: string = ''): MetaData {
      const oldStyles: string = element.style.cssText;
      const counter: HTMLElement = this.createCounter();
      // prevent creating multiple overlays for the element
      const overlay: HTMLElement = element.querySelector('.commentsOverlay') || this.createOverlay(relatedTo);

      this.disableTabNavigationOnRelativeElements(element);
      element.append(overlay);

      return {
        element,
        counter,
        overlay,
        oldStyles,
        relatedTo,
        relatedToDescription
      };
    }

    // Triggered when we disable comment mode
    private revertDisableTabNavigationOnRelativeElements(element: HTMLElement) {
      // If parent element of comments overlay has original-tabindex then we need to revert the value
      // otherwise we just need to remove the tabindex attribute
      const originalTabIndex = element.getAttribute('original-tabindex');
      if (originalTabIndex !== undefined && originalTabIndex !== null) {
        element.setAttribute('tabindex', originalTabIndex);
        element.removeAttribute('original-tabindex');
      } else {
        element.removeAttribute('tabindex');
      }

      // If we find any elements inside parent element of comments overlay that had disabled focus
      // then we revert the value by setting tabindex to original-tabindex if original-tabindex is defined or
      // we remove the tabindex attribute
      element.querySelectorAll('.comment-on-disabled-focus').forEach((el) => {
        el.classList.remove('comment-on-disabled-focus');
        const originalTabIndex = el.getAttribute('original-tabindex');
        if (originalTabIndex !== undefined && originalTabIndex !== null) {
          el.setAttribute('tabindex', originalTabIndex);
          el.removeAttribute('original-tabindex');
        } else {
          el.removeAttribute('tabindex');
        }
      });

      // If we find any elements inside the shadowroot of parent element of comments overlay that had disabled focus
      // then we revert the value by setting tabindex to original-tabindex if original-tabindex is defined or
      // we remove the tabindex attribute
      element.shadowRoot?.querySelectorAll('.comment-on-disabled-focus').forEach((el) => {
        el.classList.remove('comment-on-disabled-focus');
        const originalTabIndex = el.getAttribute('original-tabindex');
        if (originalTabIndex !== undefined && originalTabIndex !== null) {
          el.setAttribute('tabindex', originalTabIndex);
          el.removeAttribute('original-tabindex');
        } else {
          el.removeAttribute('tabindex');
        }
      });
    }

    // Triggered when we enable comment mode
    private disableTabNavigationOnRelativeElements(element: HTMLElement) {
      // If parent element of comments overlay has tabindex then we remove it
      // and we save it in original-index so we can revert the value when we disable comment mode
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex !== undefined && tabIndex !== null) {
        element.setAttribute('original-tabindex', tabIndex);
        element.removeAttribute('tabindex');
      }

      // We set tabindex=-1 to all sibling elements of comments overlay and their respective children
      // and if any of them has tabindex we save it in original-index so we can revert the value
      // when we disable commend mode
      element.querySelectorAll('*').forEach((el) => {
        const tabIndex = el.getAttribute('tabindex');
        if (tabIndex !== undefined && tabIndex !== null) {
          el.setAttribute('original-tabindex', tabIndex);
        }
        el.setAttribute('tabindex', '-1');
        el.classList.add('comment-on-disabled-focus');
      });

      // If we have a shadowroot we are probably inside etools-panel component so we
      // select all child elements of the panel-header and we do same thing as above
      element.shadowRoot?.querySelectorAll('.panel-header *:not([part="ecp-toggle-btn"])').forEach((el) => {
        const tabIndex = el.getAttribute('tabindex');
        if (tabIndex !== undefined && tabIndex !== null) {
          el.setAttribute('original-tabindex', tabIndex);
        }
        el.setAttribute('tabindex', '-1');
        el.classList.add('comment-on-disabled-focus');
      });
    }

    private createCounter(): HTMLElement {
      const element: HTMLElement = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        top: -7px;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 19px;
        height: 19px;
        background-color: #5B2121;
        border-radius: 50%;
        font-weight: bold;
        font-size: var(--etools-font-size-10, 10px);
        color: #ffffff;
        z-index: 92;
      `;
      return element;
    }

    private createOverlay(relatedTo: string): HTMLElement {
      const comments: CommentType[] = this.comments[relatedTo] || [];
      const borderColor = comments.filter((c) => c.state === 'active').length ? '#FF4545' : '#81D763';
      const element: HTMLElement = Object.assign(document.createElement('div'), {className: 'commentsOverlay'});
      element.setAttribute('tabindex', '0');
      element.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        z-index: 91;
        cursor: pointer;
        box-shadow: inset 0px 0px 0px 3px ${borderColor};
        outline: none;
        ${this.determineOverlayMargin(relatedTo)}
      `;
      return element;
    }

    determineOverlayMargin(relatedTo: string) {
      const parts = relatedTo.split('-');
      // @ts-ignore
      if (isNaN(parts[parts.length - 1])) {
        return '';
      } else {
        // If the commentable element is part of a list, leave some spacing
        return ''; //margin: 2px;
      }
    }

    private getMetaFromContainer(container: HTMLElement): MetaData[] {
      return this.getSpecialElements(container)
        .filter(({element}) => !!element)
        .map(({element, relatedTo, relatedToDescription}: CommentElementMeta) => {
          return this.createMataData(element, relatedTo, relatedToDescription);
        });
    }

    private updateCounter(meta: MetaData): void {
      const comments: CommentType[] = this.comments[meta.relatedTo] || [];
      meta.element.style.cssText = `
        position: relative;
      `;
      meta.counter.innerText = `${comments.length}`;
      if (comments.length) {
        meta.element.append(meta.counter);
      } else {
        meta.counter.remove();
      }
    }

    private updateBorderColor(meta: MetaData) {
      const comments: CommentType[] = this.comments[meta.relatedTo] || [];
      const borderColor = comments.filter((c) => c.state === 'active').length ? '#FF4545' : '#81D763';
      // @ts-ignore
      meta.overlay.style['box-shadow'] = `inset 0px 0px 0px 3px ${borderColor}
      `;
    }

    private registerListener(meta: MetaData): void {
      meta.overlay.addEventListener('click', () => this.onTriggerListener(meta));
      meta.overlay.addEventListener('keypress', (event) => event.key === 'Enter' && this.onTriggerListener(meta, true));
      meta.overlay.addEventListener('focus', () => this._handleFocus(meta));
      meta.overlay.addEventListener('blur', () => this._handleBlur(meta));
    }

    _handleFocus(meta: MetaData) {
      const comments: CommentType[] = this.comments[meta.relatedTo] || [];
      const borderColor = comments.filter((c) => c.state === 'active').length ? '#FF4545' : '#81D763';
      // eslint-disable-next-line max-len
      meta.overlay.style.boxShadow = `inset 0px 0px 0px 3px ${borderColor}, 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4)`;
    }

    _handleBlur(meta: MetaData) {
      const comments: CommentType[] = this.comments[meta.relatedTo] || [];
      const borderColor = comments.filter((c) => c.state === 'active').length ? '#FF4545' : '#81D763';
      meta.overlay.style.boxShadow = `inset 0px 0px 0px 3px ${borderColor}`;
    }

    private onTriggerListener(meta: MetaData, shouldRefocus?: boolean) {
      this.currentEditedComments = meta;
      openDialog({
        dialog: 'comments-dialog',
        dialogData: {
          collectionId: this.currentCollectionId,
          relatedTo: meta.relatedTo,
          relatedToDescription: meta.relatedToDescription,
          endpoints: store.getState().commentsData.endpoints
        }
      }).then(() => {
        this.currentEditedComments = null;

        if (shouldRefocus) {
          meta.overlay.focus();
        }
      });
    }
  };
}
