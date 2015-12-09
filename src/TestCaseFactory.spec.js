
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
        <div>
          <div>Hello</div>
          {this.props.content}
        </div>
      );
    }
  }

  /* eslint-disable react/no-multi-comp */
  class ParentElement extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <div>Hello</div>
          {this.props.children}
        </div>
      );
    }
  }

  const StatelessTestElement = () => {
    return (
      <div></div>
    );
  };

  const StatelessParentElement = props => {
    return (
      <div>{props.children}</div>
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
      const props = {
        property1: 'value1',
      };

      it('accepts a ReactElement and returns a TestCase instance', () => {
        const testCase = TestCaseFactory.createFromElement(<TestElement {...props} />);
        expect(testCase instanceof TestCase).toBe(true);
      });

      it('creates children from the children property', () => {
        const testCase = TestCaseFactory.createFromElement(
          <ParentElement {...props} >
            <div className="child">A child</div>
          </ParentElement>
        );
        expect(testCase.first('.child').textContent).toBe('A child');
      });
    });

    describe('createFromClass method', () => {
      const props = {
        property1: 'value1',
        children: <div className="child">A child</div>,
      };

      it('accepts a ReactClass and returns a TestCase instance', () => {
        const testCase = TestCaseFactory.createFromClass(TestElement, props);
        expect(testCase instanceof TestCase).toBe(true);
      });

      it('creates children from the children property', () => {
        const testCase = TestCaseFactory.createFromClass(ParentElement, props);
        expect(testCase.first('.child').textContent).toBe('A child');
      });
    });

    describe('createFromFunction method', () => {
      const props = {
        property1: 'value1',
        children: <div className="child">A child</div>,
      };

      it('accepts a function and returns a TestCase instance', () => {
        const testCase = TestCaseFactory.createFromFunction(StatelessTestElement, props);
        expect(testCase instanceof TestCase).toBe(true);
      });

      it('creates children from the children property', () => {
        const testCase = TestCaseFactory.createFromFunction(StatelessParentElement, props);
        expect(testCase.first('.child').textContent).toBe('A child');
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

    describe('trigger method', () => {
      it('throws an error if called with an unsupported eventName', () => {
        const testCase = TestCaseFactory.createFromElement(
          <TestElement />
        );
        expect(() => {
          testCase.trigger('explode');
        }).toThrowError(/explode/);
      });

      describe('supports React TestUtils.Simulate events', () => {
        const events = [
          // Clipboard events
          'onCopy',
          'onCut',
          'onPaste',

          // Composition events
          'onCompositionEnd',
          'onCompositionStart',
          'onCompositionUpdate',

          // Keyboard events
          'onKeyDown',
          'onKeyPress',
          'onKeyUp',

          // Focus events
          'onFocus',
          'onBlur',

          // Form events
          'onChange',
          'onInput',
          'onSubmit',

          // Mouse events
          'onClick',
          'onContextMenu',
          'onDoubleClick',
          'onDrag',
          'onDragEnd',
          'onDragEnter',
          'onDragExit',
          'onDragLeave',
          'onDragOver',
          'onDragStart',
          'onDrop',
          'onMouseDown',
          'onMouseEnter',
          'onMouseLeave',
          'onMouseMove',
          'onMouseOut',
          'onMouseOver',
          'onMouseUp',

          // Selection events
          'onSelect',

          // Touch events
          'onTouchCancel',
          'onTouchEnd',
          'onTouchMove',
          'onTouchStart',

          // UI events
          'onScroll',

          // Wheel events
          'onWheel',

          // Media events
          'onAbort',
          'onCanPlay',
          'onCanPlayThrough',
          'onDurationChange',
          'onEmptied',
          'onEncrypted',
          'onEnded',
          'onError',
          'onLoadedData',
          'onLoadedMetadata',
          'onLoadStart',
          'onPause',
          'onPlay',
          'onPlaying',
          'onProgress',
          'onRateChange',
          'onSeeked',
          'onSeeking',
          'onStalled',
          'onSuspend',
          'onTimeUpdate',
          'onVolumeChange',
          'onWaiting',

          // Image events
          'onLoad',
          'onError',
        ];

        function EventTestElement(props) {
          return (
            <div {...props}></div>
          );
        }

        function createEventName(eventHandlerName) {
          // Remove the leading 'on'.
          const eventName = eventHandlerName.slice(2);
          const sentenceCasedEventName =
            eventName.charAt(0).toLowerCase() + eventName.slice(1);
          return sentenceCasedEventName;
        }

        for (let i = 0; i < events.length; i++) {
          const eventHandlerName = events[i];
          const eventName = createEventName(eventHandlerName);

          /* eslint-disable no-loop-func */
          it(`simulates a ${eventName} event by calling the ${eventHandlerName} callback`, () => {
            const eventHandler = jasmine.createSpy(eventHandlerName);

            // Assign event handler to the normalized event property name.
            const props = {};
            props[eventHandlerName] = eventHandler;
            const testCase = TestCaseFactory.createFromFunction(EventTestElement, props);

            expect(eventHandler).not.toHaveBeenCalled();
            testCase.trigger(eventName);
            expect(eventHandler).toHaveBeenCalled();
          });
        }
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

      it('accepts jQuery-like selector strings', () => {
        const content = (
          <div id="contentId">
            <div className="content">Div</div>
            <span className="content">Span</span>
          </div>
        );
        const testCase = TestCaseFactory.createFromElement(
          <TestElement content={content} />
        );
        const nodes = testCase.find('#contentId span.content');
        expect(nodes.length).toBe(1);
        expect(nodes[0].textContent).toBe('Span');
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
