/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {bind, html, render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('regular event listeners', () => {
    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    test('adds event listener functions, calls with right this value', () => {
      let thisValue;
      let event;
      const listener = function(this: any, e: any) {
        event = e;
        thisValue = this;
      };
      render(html`<div (click)=${listener}></div>`, container);
      const div = container.firstElementChild as HTMLElement;
      div.click();
      assert.equal(thisValue, div);
      assert.instanceOf(event, MouseEvent);
    });

    test('adds event listener objects, calls with right this value', () => {
      let thisValue;
      let event;
      const listener = {
        handleEvent(e: Event) {
          event = e;
          thisValue = this;
        }
      };
      render(html`<div (click)=${listener}></div>`, container);
      const div = container.firstElementChild as HTMLElement;
      div.click();
      assert.equal(thisValue, listener);
      assert.instanceOf(event, MouseEvent);
    });

    test('support the bind functino for custom events', () => {
      const obj = {
        foo: false,
      };

      render(html`<div (custom)=${bind(obj, 'foo')}></div>`, container);
      const div = container.firstElementChild as HTMLElement;

      div.dispatchEvent(new CustomEvent('custom', {detail: true}));

      assert.equal(obj.foo, true);
    });

    test('only adds event listener once', () => {
      let count = 0;
      const listener = () => {
        count++;
      };
      render(html`<div (click)=${listener}></div>`, container);
      render(html`<div (click)=${listener}></div>`, container);

      const div = container.firstElementChild as HTMLElement;
      div.click();
      assert.equal(count, 1);
    });

    test('allows updating event listener', () => {
      let count1 = 0;
      const listener1 = () => {
        count1++;
      };
      let count2 = 0;
      const listener2 = () => {
        count2++;
      };
      render(html`<div (click)=${listener1}></div>`, container);
      render(html`<div (click)=${listener2}></div>`, container);

      const div = container.firstElementChild as HTMLElement;
      div.click();
      assert.equal(count1, 0);
      assert.equal(count2, 1);
    });

    test('removes event listeners', () => {
      let target;
      let listener: any = (e: any) => target = e.target;
      const t = () => html`<div (click)=${listener}></div>`;
      render(t(), container);
      const div = container.firstElementChild as HTMLElement;
      div.click();
      assert.equal(target, div);

      listener = null;
      target = undefined;
      render(t(), container);
      assert.equal(container.firstElementChild, div);
      div.click();
      assert.equal(target, undefined);
    });
  });
});
