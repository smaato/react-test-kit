
import { mockFormStore } from './index';

describe('mockFormStore', () => {
  describe('create method', () => {
    it('returns a store with a form reducer', () => {
      const store = mockFormStore();
      const state = store.getState();
      expect(state).toEqual({
        form: jasmine.any(Object),
      });
    });
  });
});
