
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default class ContainerTestCase {

  constructor(Container, state, ownProps = {}) {
    const store = createStore(() => state);
    const testElement = (
      <Provider store={store} >
        <Container {...ownProps} />
      </Provider>
    );

    TestUtils.renderIntoDocument(testElement);
  }

  expectProps(props) {
    const statePropsRemaining = props.reduce((statePropsAcc, propItem) => {
      /* eslint-disable no-loop-func */
      it(`has property ${propItem}`, () => {
        expect(statePropsAcc.hasOwnProperty(propItem)).toBe(true);
      });

      const statePropsAccNext = Object.assign({}, statePropsAcc);
      delete statePropsAccNext[propItem];
      return statePropsAccNext;
    }, Object.assign({}, this.container.stateProps));

    it('has no unexpected state props', () => {
      expect(Object.keys(statePropsRemaining)).toEqual([]);
    });
  }

  expectActionCreators(actions) {
    const dispatchPropsRemaining = actions.reduce((dispatchPropsAcc, actionItem) => {
      it(`has action ${actionItem}`, () => {
        expect(typeof dispatchPropsAcc[actionItem]).toBe('function');
      });

      const dispatchPropsNext = Object.assign({}, dispatchPropsAcc);
      delete dispatchPropsNext[actionItem];
      return dispatchPropsNext;
    }, Object.assign({}, this.container.dispatchProps));

    it('has no unexpected action creator props', () => {
      expect(Object.keys(dispatchPropsRemaining)).toEqual([]);
    });
  }

}
