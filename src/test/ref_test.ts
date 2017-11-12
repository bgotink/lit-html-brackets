/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html} from '../../lit-html/lit-html.js';
import {bind, render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('refs', () => {

    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('calls callbacks', () => {
      let ref: any = undefined;

      render(html`<div #ref=${(el: any) => ref = el}></div>`, container);
      const div = container.firstChild!;

      assert.equal(ref, div);
    });

    test('calls callbacks with correct parameters', () => {
      const obj: any = {};

      function ref(element: Element, name: string) {
        obj[name] = element;
      }

      render(html`
        <div #div=${ref}></div>
        <button #button=${ref}></button>
      `, container);
      const div = container.firstChild!;
      const button = container.lastChild!;

      assert.equal(obj.div, div);
      assert.equal(obj.button, button);
    });

    test('sets bindings', () => {
      const obj: any = {};

      render(html`<div #=${bind(obj, 'foo')}></div>`, container);
      const div = container.firstChild!;

      assert.equal(obj.foo, div);
    });

    test('sets properties', () => {
      const obj: any = {};

      render(html`<div #foo=${obj}></div>`, container);
      const div = container.firstChild!;

      assert.equal(obj.foo, div);
    });
  });
});
