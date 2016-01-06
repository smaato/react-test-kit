
import { createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

export default function mockFormStore() {
  const store = createStore((state = {}, action) => {
    return {
      form: formReducer(state.form, action),
    };
  });

  return store;
}
