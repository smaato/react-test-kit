
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Sizzle from 'sizzle';

export class TestCase {

  constructor(reactElement) {
    this.element = TestUtils.renderIntoDocument(reactElement);
    this.dom = ReactDOM.findDOMNode(this.element);
  }

  trigger(eventName, node = this.dom) {
    const action = TestUtils.Simulate[eventName];
    if (!action || typeof action !== 'function') {
      throw new Error(
        `TestCase trigger method called with an eventName which isn\'t supported
         by TestUtils.Simulate: '${eventName}'`
      );
    }
    action(node);
  }

  // Mimic $.find()
  find(selector, node = this.dom) {
    const results = new Sizzle(selector, node);
    return results;
  }

  // Mimic $.first()
  first(selector, node = this.dom) {
    const results = new Sizzle(selector, node);
    if (results.length === 0) return undefined;
    return results[0];
  }

  findComponents(reactClass) {
    return TestUtils.scryRenderedComponentsWithType(this.element, reactClass);
  }

  firstComponent(reactClass) {
    return TestUtils.findRenderedComponentWithType(this.element, reactClass);
  }

}

function createFromElement(reactElement) {
  return new TestCase(reactElement);
}

function createFromClass(reactClass, props = {}) {
  const reactElement = React.createElement(reactClass, props, props.children);
  return createFromElement(reactElement);
}

/**
 * Wrap a stateless functional component in a regular component class.
 */
function convertToClass(statelessFunctionalComponent) {
  return React.createClass({
    render: function render() {
      return statelessFunctionalComponent(this.props);
    },
  });
}

/**
 * This addresses problems with testing stateless functional components.
 * Relevant issue: https://github.com/facebook/react/issues/4972
 */
function createFromFunction(fn, props) {
  // We need to wrap the function in a class to be able to instantiate
  // and render it.
  const reactClass = convertToClass(fn);
  return createFromClass(reactClass, props);
}

export default {
  createFromElement: createFromElement,
  createFromClass: createFromClass,
  createFromFunction: createFromFunction,
};
