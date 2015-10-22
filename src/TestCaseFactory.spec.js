
import React, {
  Component,
} from 'react';

import {
  TestCaseFactory,
  TestCase,
} from './index';

describe('TestCaseFactory', () => {
  class TestElement extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div className="outer" onClick={this.props.onClick}>
          <div className="inner">Hello</div>
          {this.props.content}
        </div>
      );
    }
  }

  const StatelessTestElement = (props) => {
    return (
      <div className="outer" onClick={props.onClick}>
        <div className="inner">Hello</div>
        {props.content}
      </div>
    );
  };

  /* eslint-disable react/no-multi-comp */
  class ChildComponent extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div></div>
      );
    }
  }

  describe('factory', () => {
    describe('createFromElement method', () => {
      it('accepts a ReactElement and returns a TestCase instance', () => {
        const props = {
          property1: 'value1',
        };
        const testCase = TestCaseFactory.createFromElement(<TestElement {...props} />);
        expect(testCase instanceof TestCase).toBe(true);
      });
    });

    describe('createFromClass method', () => {
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
    });

    describe('createFromFunction method', () => {
      it('accepts a function and returns a TestCase instance', () => {
        const props = {
          property1: 'value1',
        };
        const testCase = TestCaseFactory.createFromFunction(StatelessTestElement, props);
        expect(testCase instanceof TestCase).toBe(true);
      });
    });
  });

  describe('TestCase instance', () => {
    describe('dom property', () => {
      it('is an HTMLElement', () => {
        const testCase = TestCaseFactory.createFromElement(<TestElement />);
        expect(testCase.dom instanceof HTMLElement).toBe(true);
      });
    });

    describe('element property', () => {
      it('is an object', () => {
        const testCase = TestCaseFactory.createFromElement(<TestElement />);
        expect(typeof testCase.element).toBe('object');
      });
    });

    describe('click method', () => {
      it('simulates a click event by calling the onClick callback', () => {
        const onClick = jasmine.createSpy('onClick');
        const testCase = TestCaseFactory.createFromElement(
          <TestElement
            onClick={onClick}
          />
        );
        expect(onClick).not.toHaveBeenCalled();
        testCase.click();
        expect(onClick).toHaveBeenCalled();
      });
    });

    describe('find method', () => {
      it('returns an array of child nodes which match the query', () => {
        const content = (<div className="content">Content</div>);
        const testCase = TestCaseFactory.createFromElement(
          <TestElement content={content} />
        );
        const nodes = testCase.find('div');
        expect(nodes.length).toBe(2);
        expect(nodes[0].textContent).toBe('Hello');
        expect(nodes[1].textContent).toBe('Content');
      });
    });

    describe('first method', () => {
      it('returns the first child node to match the query', () => {
        const content = (<div className="content">Content</div>);
        const testCase = TestCaseFactory.createFromElement(
          <TestElement content={content} />
        );
        const node = testCase.first('div');
        expect(node.textContent).toBe('Hello');
      });
    });

    describe('findComponents method', () => {
      it('returns an array of child components of the provided class', () => {
        const content = (<ChildComponent />);
        const testCase = TestCaseFactory.createFromElement(
          <TestElement content={content} />
        );
        const elements = testCase.findComponents(ChildComponent);
        expect(elements.length).toBe(1);
        expect(elements[0] instanceof ChildComponent).toBe(true);
      });
    });

    describe('firstComponent method', () => {
      it('returns the first child component of the provided class', () => {
        const content = (<ChildComponent />);
        const testCase = TestCaseFactory.createFromElement(
          <TestElement content={content} />
        );
        const element = testCase.firstComponent(ChildComponent);
        expect(element instanceof ChildComponent).toBe(true);
      });
    });
  });
});
