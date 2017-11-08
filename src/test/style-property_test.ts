/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html} from '../../lit-html/lit-html.js';
import {render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('style properties', () => {

    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('sets incoming values', () => {
      render(html`<div [style.color]=${'blue'} [style.borderRadius]=${'2px'}></div>`, container);
      const div = container.firstChild as HTMLElement;

      assert.equal(div.style.color, 'blue');
      assert.equal(div.style.borderRadius, '2px');
    });

    test('removes values when falsey', () => {
      render(html`<div [style.color]=${null} [style.borderRadius]=${false}></div>`, container);
      const div = container.firstChild as HTMLElement;

      assert.equal(div.style.color, '');
      assert.equal(div.style.borderRadius, '');
    });
  });
});
