/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html, render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('class properties', () => {
    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('sets classes if the value is true', () => {
      render(html`<div [class.foo]=${true} [class.bar]=${'true'}></div>`, container);
      const div = container.firstChild as Element;

      assert.equal(div.classList.contains('foo'), true);
      assert.equal(div.classList.contains('bar'), true);
    });

    test('doesn\'t set classes if the value is false', () => {
      render(html`<div [class.foo]=${false} [class.bar]=${'false'}></div>`, container);
      const div = container.firstChild as Element;

      assert.equal(div.classList.contains('foo'), false);
      assert.equal(div.classList.contains('bar'), false);
    });

    test('sets classes if the value is truthy', () => {
      render(html`<div [class.foo]=${'truthy string'} [class.bar]=${1}></div>`, container);
      const div = container.firstChild as Element;

      assert.equal(div.classList.contains('foo'), true);
      assert.equal(div.classList.contains('bar'), true);
    });

    test('doesn\'t set classes if the value is falsey', () => {
      render(html`<div [class.foo]=${''} [class.bar]=${0}></div>`, container);
      const div = container.firstChild as Element;

      assert.equal(div.classList.contains('foo'), false);
      assert.equal(div.classList.contains('bar'), false);
    });
  });
});
