
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
  // Disallow React Classes and stateless functional components.
  if (typeof reactElement === 'function') {
    throw new Error('createFromElement expects a React Element (i.e. a class instantiated via JSX) but got a function.');
  }

  // Disallow elements created from stateless functional components.
  if (!reactElement.type.prototype.render) {
    throw new Error('createFromElement expects an instance of a React Class (i.e. a class with a render method) but no render method was found.');
  }

  return new TestCase(reactElement);
}

function createFromClass(reactClass, props = {}) {
  // Disallow React Elements.
  if (typeof reactClass === 'object') {
    throw new Error('createFromClass expects a React Class but got an object (e.g. a React Element).');
  }

  // Disallow stateless functional components.
  if (!reactClass.prototype.render) {
    throw new Error('createFromClass expects a React Class (i.e. a class with a render method) but no render method was found.');
  }

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
  // Disallow React Elements.
  if (typeof fn === 'object') {
    throw new Error('createFromFunction expects a stateless function but got an object (e.g. a React Element).');
  }

  // Disallow React Classes.
  if (fn.prototype.render) {
    throw new Error('createFromFunction expects a stateless function, but got a React Class (i.e. a class with a render method).');
  }

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
