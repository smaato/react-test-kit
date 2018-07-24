
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ContainerTestCase } from './index';

describe('ContainerTestCase', () => {
  function mapStateToProps(state, ownProps) {
    return {
      prop1: state.reducerSource.something,
      prop2: undefined,
      prop3: ownProps.prop3,
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

  const testCase = new ContainerTestCase(TestContainer, {
    reducerSource: {},
  }, {
    prop3: null,
  });

  describe('Props', () => {
    testCase.expectProps([
      'prop1',
      'prop2',
      'prop3',
    ]);
  });

  describe('Action creators', () => {
    testCase.expectActionCreators([
      'action1',
      'action2',
    ]);
  });
});
