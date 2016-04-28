
# React Test Kit

These tools make it easier for us to test apps built with React and Redux.

## Dependencies

- Node 4.x.x
- Browserify with the Babelify transform
- Jasmine (for some tools, see below)
- React, react-dom, react-addons-test-utils
- Redux, redux-thunk, react-redux
- Sizzle

## Getting Started

#### Setup & Run

```bash
npm install
npm install -g gulp
gulp
```

## Usage

Just import the tools you want into your test file:

```javascript
import {
  ContainerTestCase,
  MockedRouteActions,
  MockedStore,
  mockFormStore,
  TestCase,
  TestCaseFactory,
} from 'react-test-kit';
```

## Tools

#### TestCaseFactory

Use this factory to test React components' state by passing in various props,
inspecting their DOM, and simulating user interactions.

**WARNING:** Methods for finding child Components won't work unless the root
component is a _composite Component_ (e.g. a Component you've defined), not a
_native Component_ (e.g. div or table). This seems related to
[this React issue](https://github.com/facebook/react/issues/1533#issuecomment-52243372).

```javascript
// Construction via factory methods:
it('accepts a ReactElement and returns a TestCase instance', () => {
  const props = {
    property1: 'value1',
  };
  const testCase = TestCaseFactory.createFromElement(<TestElement {...props} />);
  expect(testCase instanceof TestCase).toBe(true);
});

it('accepts a ReactClass and returns a TestCase instance', () => {
  const props = {
    property1: 'value1',
    children: <div>A child</div>,
  };
  // Alternatively, you can use TestCaseFactory.createFromClass here.
  const testCase = TestCaseFactory.create(TestElement, props);
  expect(testCase instanceof TestCase).toBe(true);
});

it('accepts a function and returns a TestCase instance', () => {
  const props = {
    property1: 'value1',
  };
  // Alternatively, you can use TestCaseFactory.createFromFunction here.
  const testCase = TestCaseFactory.create(StatelessTestElement, props);
  expect(testCase instanceof TestCase).toBe(true);
});

// The testCase instance surfaces a method for triggering events and simulating
// user interaction. It supports all of the same events that React supports.
testCase.trigger('click', optDomNode, optEventData);

// You can query its DOM.
const nodes = testCase.find('div');
const node = testCase.first('div');

// You can also query it for React components.
const elements = testCase.findComponents(ChildComponent);
const element = testCase.firstComponent(ChildComponent);
```

#### ContainerTestCase

Use this class to test that Redux `container` classes are providing the right
properties and actions.

Note: This class dynamically creates its own Jasmine assertions (so it
depends upon Jasmine).

```javascript
// Given a Container that looks like this:
function mapStateToProps(state) {
  return {
    prop1: state.reducerSource.something,
    prop2: undefined,
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    action1: () => {},
    action2: () => {},
  };
  return bindActionCreators(actions, dispatch);
}

const TestContainer = connect(mapStateToProps, mapDispatchToProps)(() => {
});

// You have to pass it into `ContainerTestCase` with a mock state object,
// and then run tests on it, like this:
const testCase = new ContainerTestCase(TestContainer, {
  reducerSource: {},
});

describe('Props', () => {
  testCase.expectProps([
    'prop1',
    'prop2',
  ]);
});

describe('Action creators', () => {
  testCase.expectActionCreators([
    'action1',
    'action2',
  ]);
});
```

#### MockedStore

Use this class to test that asynchronous Redux action creators create the
right actions in the right order.

```javascript
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
```

#### mockFormStore

Call this function to get a store instance that uses the `redux-form` reducer.

Given a component that uses redux-form and looks something like this:

```javascript
import React, {
  Component,
} from 'react';
import {reduxForm} from 'redux-form';

class AccountForm extends Component {
  // ...
}

AccountForm = reduxForm({
  form: 'accountForm',
  fields: [ /* ... */ ],
})(AccountForm);

export default AccountForm;
```

You can create a spec that tests it like this:

```javascript
import React from 'react';
import { Provider } from 'react-redux';
import {
  TestCaseFactory,
  mockFormStore,
} from 'react-test-kit';

import AccountForm from './AccountForm.jsx';

describe('AccountForm', () => {
  it('is testable', () => {
    const store = mockFormStore();

    const props = {
      // ...
    };

    const testCase = TestCaseFactory.createFromElement(
      <Provider store={store}>
        <AccountForm {...props} />
      </Provider>
    );

    // expect() something
  });
});
```

#### MockedRouteActions

Use this class to create `redux-router` actions for testing action creators
that affect the route (e.g. redirects).

**Note:** We've since migrated to `react-router-redux` so this tool is no
longer being supported and will be removed in the near future.

```javascript
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
```
