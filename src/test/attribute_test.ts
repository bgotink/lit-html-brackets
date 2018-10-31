/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html, render} from '../lit-html-brackets.js';
import {stripExpressionMarkers} from './test-utils.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('attributes', () => {
    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('renders to an attribute', () => {
      render(html`<div foo="${'bar'}"></div>`, container);
      assert.equal(stripExpressionMarkers(container.innerHTML), '<div foo="bar"></div>');
    });

    test('renders to an attribute without quotes', () => {
      render(html`<div foo=${'bar'}></div>`, container);
      assert.equal(stripExpressionMarkers(container.innerHTML), '<div foo="bar"></div>');
    });

    test('renders interpolation to an attribute', () => {
      render(html`<div foo="1${'bar'}2${'baz'}3"></div>`, container);
      assert.equal(stripExpressionMarkers(container.innerHTML), '<div foo="1bar2baz3"></div>');
    });
  });
});
