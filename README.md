
# React Test Kit

> Tools for easy testing of a React and Redux codebase

## Dependencies

- Node 4.1.0
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
  TestCase,
  TestCaseFactory,
} from 'react-test-kit';
```

## Tools

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

#### MockedRouteActions

Use this class to create `redux-router` actions for testing action creators
that affect the route (e.g. redirects).

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
  };
  const children = (
    <div>A child</div>
  );
  const testCase = TestCaseFactory.createFromClass(TestElement, props, children);
  expect(testCase instanceof TestCase).toBe(true);
});

it('accepts a function and returns a TestCase instance', () => {
  const props = {
    property1: 'value1',
  };
  const testCase = TestCaseFactory.createFromFunction(StatelessTestElement, props);
  expect(testCase instanceof TestCase).toBe(true);
});

// The testCase instance surfaces methods for simulating user interaction.
testCase.click();

// You can query its DOM.
const nodes = testCase.find('div');
const node = testCase.first('div');

// You can also query it for React components.
const elements = testCase.findComponents(ChildComponent);
const element = testCase.firstComponent(ChildComponent);
```
