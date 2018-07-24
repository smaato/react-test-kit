
export default class ContainerTestCase {

  constructor(Container, state, ownProps = {}) {
    this.container = new Container({
      store: {
        getState: () => {
          return state;
        },
      },
      ...ownProps,
    });

    // As of react-redux 3.0.0, mapStateToProps, and mapDispatchToProps are
    // only called when render() is called.
    this.container.render();
  }

  expectProps(props) {
    const stateProps = Object.assign({}, this.container.stateProps);
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      /* eslint-disable no-loop-func */
      it(`has property ${prop}`, () => {
        expect(stateProps.hasOwnProperty(prop)).toBe(true);
        delete stateProps[prop];
      });
    }
    it('has no unexpected state props', () => {
      expect(Object.keys(stateProps)).toEqual([]);
    });
  }

  expectActionCreators(actions) {
    const dispatchProps = Object.assign({}, this.container.dispatchProps);
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      /* eslint-disable no-loop-func */
      it(`has action ${action}`, () => {
        expect(typeof dispatchProps[action]).toBe('function');
        delete dispatchProps[action];
      });
    }
    it('has no unexpected action creator props', () => {
      expect(Object.keys(dispatchProps)).toEqual([]);
    });
  }

}
