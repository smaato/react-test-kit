
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/**
 * Creates a mock of Redux store with middleware. Pass the ctor an array of
 * expected actions to create an instance of the store, and then pass dispatch()
 * the result of calling an action creator. Borrowed from the Redux guide:
 * https://rackt.github.io/redux/docs/recipes/WritingTests.html
 */
function mockStore(getState, expectedActions, onLastAction) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.');
  }
  if (typeof onLastAction !== 'undefined' && typeof onLastAction !== 'function') {
    throw new Error('onLastAction should either be undefined or function.');
  }

  function mockStoreWithoutMiddleware() {
    return {
      // When an action creator is called, this method is passed into it.
      getState() {
        return typeof getState === 'function' ?
          getState() :
          getState;
      },

      dispatch(action) {
        const expectedAction = expectedActions.shift();
        expect(action).toEqual(expectedAction);
        if (onLastAction && !expectedActions.length) {
          onLastAction();
        }
        return action;
      },
    };
  }

  const mockStoreWithMiddleware = applyMiddleware(thunk)(mockStoreWithoutMiddleware);
  return mockStoreWithMiddleware();
}

export default class MockedStore {

  constructor(getState = {}) {
    // If the actionCreator being tests depends on getState, you can use this
    // argument to provide it with a default state.
    this.getState = getState;
  }

  test(actionCreator, expectedActions, done) {
    this.store = mockStore(this.getState, expectedActions, done);
    this.store.dispatch(actionCreator);
  }

}
