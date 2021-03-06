import Immutable from 'immutable';

import Marker from 'app/Viewer/utils/Marker.js';
import * as actions from 'app/Viewer/actions/uiActions';
import scroller from 'app/Viewer/utils/Scroller';
import * as types from 'app/Viewer/actions/actionTypes';

describe('Viewer uiActions', () => {
  describe('closePanel()', () => {
    it('should return a CLOSE_PANEL with panel passed', () => {
      const action = actions.closePanel();
      expect(action).toEqual({ type: types.CLOSE_PANEL });
    });
  });
  describe('openPanel()', () => {
    it('should return a OPEN_PANEL with panel passed', () => {
      const action = actions.openPanel('a panel');
      expect(action).toEqual({ type: types.OPEN_PANEL, panel: 'a panel' });
    });
  });
  describe('selectTargetDocument()', () => {
    it('should return a SELECT_TARGET_DOCUMENT with id', () => {
      const action = actions.selectTargetDocument('id');
      expect(action).toEqual({ type: types.SELECT_TARGET_DOCUMENT, id: 'id' });
    });
  });
  describe('selectTargetDocument()', () => {
    it('should return a SELECT_TARGET_DOCUMENT with id', () => {
      const action = actions.selectTargetDocument('id');
      expect(action).toEqual({ type: types.SELECT_TARGET_DOCUMENT, id: 'id' });
    });
  });

  describe('highlightReference()', () => {
    it('should return a HIGHLIGHT_REFERENCE with id', () => {
      const action = actions.highlightReference('id');
      expect(action).toEqual({ type: types.HIGHLIGHT_REFERENCE, reference: 'id' });
    });
  });

  describe('deactivateReference', () => {
    it('should dispatch a DEACTIVATE_REFERENCE with id', () => {
      const action = actions.deactivateReference('id');
      expect(action).toEqual({ type: types.DEACTIVATE_REFERENCE });
    });
  });

  describe('scrollToActive', () => {
    let dispatch;
    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch');
      spyOn(actions, 'activateReference').and.returnValue({ type: 'activateReference' });
    });

    it('should scroll to active if goToActive is true', () => {
      actions.scrollToActive({ _id: 'id' }, {}, '', true)(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: types.GO_TO_ACTIVE, value: false });
      //expect(dispatch).toHaveBeenCalledWith({type: 'activateReference'});
      //expect(actions.activateReference).toHaveBeenCalledWith({_id: 'id'}, {}, '');
    });
  });

  describe('activateReference()', () => {
    let dispatch;
    beforeEach(() => {
      spyOn(scroller, 'to');
      spyOn(window.document, 'querySelector').and.returnValue(true);
      dispatch = jasmine.createSpy('dispatch');
    });

    it('should dispatch a ACTIVATE_REFERENCE with id', () => {
      actions.activateReference({ _id: 'id' }, {})(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: types.ACTIVE_REFERENCE, reference: 'id' });
      expect(dispatch).toHaveBeenCalledWith({ type: types.OPEN_PANEL, panel: 'viewMetadataPanel' });
      expect(dispatch).toHaveBeenCalledWith({ type: 'viewer.sidepanel.tab/SET', value: 'references' });
    });

    it('should dispatch a SHOW_TAB references by default', () => {
      actions.activateReference({ _id: 'id' }, {})(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'viewer.sidepanel.tab/SET', value: 'references' });
    });

    it('should dispatch a SHOW_TAB to a diferent tab if passed', () => {
      actions.activateReference({ _id: 'id' }, {}, 'another tab')(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'viewer.sidepanel.tab/SET', value: 'another tab' });
    });

    it('should dispatch a SHOW_TAB references if Array is passed (when selecting a doc reference)', () => {
      actions.activateReference({ _id: 'id' }, {}, [])(dispatch);
      expect(dispatch).toHaveBeenCalledWith({ type: 'viewer.sidepanel.tab/SET', value: 'references' });
    });

    it('should scroll to the elements', (done) => {
      actions.activateReference({ _id: 'id' }, {})(dispatch);
      setTimeout(() => {
        expect(scroller.to).toHaveBeenCalledWith('.document-viewer a[data-id="id"]', '.document-viewer', { duration: 100 });
        expect(scroller.to).toHaveBeenCalledWith('.metadata-sidepanel .item-id', '.metadata-sidepanel .sidepanel-body', { duration: 100 });
        done();
      });
    });
  });

  describe('selectReference()', () => {
    let dispatch;
    let references;

    beforeEach(() => {
      dispatch = jasmine.createSpy('dispatch');
      references = [{ _id: 'id1' }, { _id: 'id2', range: 'range' }];
      actions.selectReference(references[1], {})(dispatch);
      dispatch.calls.argsFor(0)[0](dispatch);
    });

    it('should dispatch a call to activateReference', () => {
      expect(dispatch).toHaveBeenCalledWith({ type: types.ACTIVE_REFERENCE, reference: 'id2' });
      expect(dispatch).toHaveBeenCalledWith({ type: types.OPEN_PANEL, panel: 'viewMetadataPanel' });
    });

    it('should dispatch a SET_TARGET_SELECTION with found range', () => {
      expect(dispatch).toHaveBeenCalledWith({ type: types.SET_TARGET_SELECTION, targetRange: 'range' });
    });
  });

  describe('resetReferenceCreation()', () => {
    it('should RESET_REFERENCE_CREATION and unset targetDocument', () => {
      const dispatch = jasmine.createSpy('dispatch');
      actions.resetReferenceCreation()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({ type: types.RESET_REFERENCE_CREATION });
      expect(dispatch).toHaveBeenCalledWith({ type: 'viewer/targetDoc/UNSET' });
      expect(dispatch).toHaveBeenCalledWith({ type: 'viewer/targetDocHTML/UNSET' });
    });
  });

  describe('highlightSnippets', () => {
    it('should unmark all and mark snippets passed only once (only the ones for the pages being rendered)', () => {
      const container = document.createElement('div');
      let innerHTML = '<div class="main-wrapper">unique ';
      innerHTML += 'snippet <span>marked</span> (with)  multiple spaces';
      innerHTML += 'snippet marked </br>new line';
      innerHTML += 'page not in range 5';
      innerHTML += 'page not in range 6';
      innerHTML += 'page not in range 7';
      innerHTML += '</div>';
      container.innerHTML = innerHTML;
      document.body.appendChild(container);
      Marker.init('div.main-wrapper');

      const snippets = Immutable.fromJS({
        count: 7,
        metadata: [],
        fullText: [
          { text: 'unique', page: 1 },
          { text: 'unique', page: 2 },
          { text: 'snippet <b>marked</b> (with) multiple spaces', page: 3 },
          { text: 'snippet <b>marked</b>\nnew line', page: 4 },
          { text: 'page not in range 5', page: 5 },
          { text: 'page not in range 6', page: 6 },
          { text: 'page not in range 7', page: 7 }
        ]
      });

      const pages = [1, 2, 3, 4];

      actions.highlightSnippets(snippets, pages);
      let marks = document.querySelectorAll('mark');
      expect(marks.length).toBe(6);
      expect(marks[0].innerHTML).toBe('unique');
      expect(marks[1].innerHTML).toBe('snippet ');
      expect(marks[2].innerHTML).toBe('marked');
      expect(marks[3].innerHTML).toBe(' (with)  multiple spaces');
      expect(marks[4].innerHTML).toBe('snippet marked ');
      expect(marks[5].innerHTML).toBe('new line');

      actions.highlightSnippets(Immutable.fromJS({
        count: 0,
        metadata: [],
        fullText: []
      }));
      marks = document.querySelectorAll('mark');
      expect(marks.length).toBe(0);

      container.innerHTML = '';
    });
  });
});
