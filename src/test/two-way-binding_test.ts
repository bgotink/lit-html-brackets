/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html} from '../../lit-html/lit-html.js';
import {bind, render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('two-way binding', () => {

    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('sets incoming values', () => {
      const obj = {
        foo: 'Lorem',
        bar: 'Ipsum',
      };

      render(html`<div [(prop)]=${bind(obj, 'foo')} [(prop2::some-event)]=${bind(obj, 'bar')}></div>`, container);
      const div = container.firstChild as HTMLElement;

      assert.equal((div as any).prop, 'Lorem');
      assert.equal((div as any).prop2, 'Ipsum');
    });

    test('receive changes', () => {
      const obj = {
        foo: 'Lorem',
        bar: 'Ipsum',
      };

      render(html`<div [(prop)]=${bind(obj, 'foo')} [(prop2::some-event)]=${bind(obj, 'bar')}></div>`, container);
      const div = container.firstChild as HTMLElement;

      (div as any).prop = 'Gaudeamus';
      (div as any).prop2 = 'Igitur';

      div.dispatchEvent(new CustomEvent('prop-changed'));

      assert.equal(obj.foo, 'Gaudeamus');
      assert.equal(obj.bar, 'Ipsum');

      div.dispatchEvent(new CustomEvent('prop2-changed'));

      assert.equal(obj.bar, 'Ipsum');

      div.dispatchEvent(new CustomEvent('some-event'));

      assert.equal(obj.bar, 'Igitur');
    });
  });
});
