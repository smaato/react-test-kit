
import { MockedStore } from './index';

describe('MockedStore', () => {
  describe('test method', () => {
    it('asserts that asynchronous actions are created in sequence', (done) => {
      const actionCreator = () => (dispatch) => {
        dispatch({
          type: 'A',
        });
        setTimeout(() => {
          dispatch({
            type: 'B',
          });
        }, 10);
      };
      const expectedActions = [{
        type: 'A',
      }, {
        type: 'B',
      }];
      const store = new MockedStore();
      store.expectActionsFromCreator(actionCreator(), expectedActions, done);
    });

    it('calls the done callback when the actions are complete', (done) => {
      const actionCreator = () => (dispatch) => {
        dispatch({
          type: 'A',
        });
      };
      const expectedActions = [{
        type: 'A',
      }];
      const store = new MockedStore();
      const doneSpy = jasmine.createSpy('done').and.callFake(() => {
        done();
      });
      store.expectActionsFromCreator(actionCreator(), expectedActions, doneSpy);
      expect(doneSpy).toHaveBeenCalled();
    });

    it('references the mocked state object', (done) => {
      const state = {
        prop: 'value',
      };
      const actionCreator = () => (dispatch, getState) => {
        dispatch({
          payload: getState().prop,
        });
      };
      const expectedActions = [{
        payload: state.prop,
      }];
      const store = new MockedStore(state);
      store.expectActionsFromCreator(actionCreator(), expectedActions, done);
    });
  });
});
