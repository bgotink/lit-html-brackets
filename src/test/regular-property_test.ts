/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html} from '../../lit-html/lit-html.js';
import {render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('regular properties', () => {

    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('sets properties', () => {
      render(html`<div [foo]=${123} [bar]=${456}></div>`, container);
      const div = container.firstChild!;
      assert.equal((div as any).foo, 123);
      assert.equal((div as any).bar, 456);
    });

    test('sets a property without quotes', () => {
      render(html`<div [foo]=${123}></div>`, container);
      const div = container.firstChild!;
      assert.equal((div as any).foo, 123);
    });

    test('sets an interpolation to a property', () => {
      render(html`<div [foo]="1${'bar'}2${'baz'}3"></div>`, container);
      const div = container.firstChild!;
      assert.equal((div as any).foo, '1bar2baz3');
    });
  });
});
