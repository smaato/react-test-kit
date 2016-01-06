
export default class ContainerTestCase {

  constructor(Container, state) {
    this.container = new Container({
      store: {
        getState: () => {
          return state;
        },
      },
    });

    // As of react-redux 3.0.0, mapStateToProps, and mapDispatchToProps are
    // only called when render() is called.
    this.container.render();
  }

  expectProps(props) {
    const stateProps = this.container.stateProps;
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      /* eslint-disable no-loop-func */
      it(`has property ${prop}`, () => {
        expect(stateProps.hasOwnProperty(prop)).toBe(true);
      });
    }
  }

  expectActionCreators(actions) {
    const dispatchProps = this.container.dispatchProps;
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      /* eslint-disable no-loop-func */
      it(`has action ${action}`, () => {
        expect(typeof dispatchProps[action]).toBe('function');
      });
    }
  }

}
