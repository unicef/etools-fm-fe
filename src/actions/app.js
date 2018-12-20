/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
;
;
export const navigate = (path) => (dispatch) => {
    // Extract the page name from path.
    const page = path === '/' ? 'page-one' : path.slice(1);
    // Any other info you might want to extract from the path (like page type),
    // you can do here
    dispatch(loadPage(page));
    // Close the drawer - in case the *path* change came from a link in the drawer.
    dispatch(updateDrawerState(false));
};
const loadPage = (page) => (dispatch) => {
    switch (page) {
        case 'page-one':
            import('../components/pages/page-one.js').then(() => {
                // Put code in here that you want to run every time when
                // navigating to view1 after my-view1.js is loaded.
            });
            break;
        case 'page-two':
            import('../components/pages/page-two.js');
            break;
        default:
            page = 'page-not-found';
            import('../components/pages/page-not-found.js');
    }
    dispatch(updatePage(page));
};
const updatePage = (page) => {
    return {
        type: UPDATE_PAGE,
        page
    };
};
export const updateDrawerState = (opened) => {
    return {
        type: UPDATE_DRAWER_STATE,
        opened
    };
};
