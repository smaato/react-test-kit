
import { MockedRouteActions } from './index';

describe('MockedRouteActions', () => {
  describe('replaceState method', () => {
    it('returns an action object', () => {
      const state = {};
      const pathname = '/testPath';
      const action = MockedRouteActions.replaceState(state, pathname);
      expect(action).toEqual({
        type: '@@reduxReactRouter/historyAPI',
        payload: {
          method: 'replaceState',
          args: [
            state,
            pathname,
          ],
        },
      });
    });

    it('supports query params', () => {
      const state = {};
      const pathname = '/testPath';
      const query = {
        queryParam: 'queryValue',
      };
      const action = MockedRouteActions.replaceState(state, pathname, query);
      expect(action).toEqual({
        type: '@@reduxReactRouter/historyAPI',
        payload: {
          method: 'replaceState',
          args: [
            state,
            pathname,
            query,
          ],
        },
      });
    });
  });

  describe('pushState method', () => {
    it('returns an action object', () => {
      const state = {};
      const pathname = '/testPath';
      const action = MockedRouteActions.pushState(state, pathname);
      expect(action).toEqual({
        type: '@@reduxReactRouter/historyAPI',
        payload: {
          method: 'pushState',
          args: [
            state,
            pathname,
          ],
        },
      });
    });

    it('supports query params', () => {
      const state = {};
      const pathname = '/testPath';
      const query = {
        queryParam: 'queryValue',
      };
      const action = MockedRouteActions.pushState(state, pathname, query);
      expect(action).toEqual({
        type: '@@reduxReactRouter/historyAPI',
        payload: {
          method: 'pushState',
          args: [
            state,
            pathname,
            query,
          ],
        },
      });
    });
  });
});
