
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ContainerTestCase } from './index';

describe('ContainerTestCase', () => {
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
});
