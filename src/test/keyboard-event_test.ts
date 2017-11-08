/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import {html} from '../../lit-html/lit-html.js';
import {render} from '../lit-html-brackets.js';

const {assert} = chai;

suite('lit-html-brackets', () => {
  suite('filtered keyboard event listeners', () => {

    let container: HTMLElement;

    setup(() => {
      container = document.createElement('div');
    });

    interface EventOptions {
      key: string;

      altKey?: boolean;
      ctrlKey?: boolean;
      metaKey?: boolean;
      shiftKey?: boolean;
    }

    function createEvent(type: 'keyup'|'keydown', options: EventOptions): KeyboardEvent {
      const event = new KeyboardEvent(type);

      for (const option of Object.keys(options) as Array<keyof EventOptions>) {
        Object.defineProperty(event, option, {value: options[option]});
      }

      return event;
    }

    suite('keyup', () => {
      test('adds event listener functions for specific keys', () => {
        let id: string = null!;
        let capturedEvent: KeyboardEvent = null!;

        function createListener(_id: string) {
          return (e: KeyboardEvent) => {
            capturedEvent = e;
            id = _id;
          };
        }

        render(
            html`<div (keyup.enter)=${createListener('enter')} (keyup.up)=${createListener('up')}></div>`, container);
        const div = container.firstChild as HTMLElement;

        let event = createEvent('keyup', {key: 'enter'});
        div.dispatchEvent(event);

        assert.equal(id, 'enter');
        assert.equal(capturedEvent, event);

        id = null!;
        capturedEvent = null!;

        event = createEvent('keyup', {key: 'up'});
        div.dispatchEvent(event);

        assert.equal(id, 'up');
        assert.equal(capturedEvent, event);
      });

      test('respects modifiers', () => {
        let id: string = null!;
        let capturedEvent: KeyboardEvent = null!;

        function createListener(_id: string) {
          return (e: KeyboardEvent) => {
            capturedEvent = e;
            id = _id;
          };
        }

        render(
            html
            `<div (keyup.enter)=${createListener('enter')} (keyup.shift.enter)=${createListener('shift.enter')}></div>`,
            container);
        const div = container.firstChild as HTMLElement;

        let event = createEvent('keyup', {key: 'enter'});
        div.dispatchEvent(event);

        assert.equal(id, 'enter');
        assert.equal(capturedEvent, event);

        id = null!;
        capturedEvent = null!;

        event = createEvent('keyup', {key: 'enter', shiftKey: true});
        div.dispatchEvent(event);

        assert.equal(id, 'shift.enter');
        assert.equal(capturedEvent, event);
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
        render(html`<div (keyup.enter)=${listener}></div>`, container);
        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keyup', {key: 'enter'}));
        assert.equal(thisValue, listener);
        assert.instanceOf(event, KeyboardEvent);
      });

      test('only adds event listener once', () => {
        let count = 0;
        const listener = () => {
          count++;
        };
        render(html`<div (keyup.enter)=${listener}></div>`, container);
        render(html`<div (keyup.enter)=${listener}></div>`, container);

        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keyup', {key: 'enter'}));
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
        render(html`<div (keyup.enter)=${listener1}></div>`, container);
        render(html`<div (keyup.enter)=${listener2}></div>`, container);

        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keyup', {key: 'enter'}));
        assert.equal(count1, 0);
        assert.equal(count2, 1);
      });

      test('removes event listeners', () => {
        let target;
        let listener: any = (e: any) => target = e.target;
        const t = () => html`<div (keyup.enter)=${listener}></div>`;
        render(t(), container);
        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keyup', {key: 'enter'}));
        assert.equal(target, div);

        listener = null;
        target = undefined;
        render(t(), container);
        assert.equal(container.firstChild, div);
        div.dispatchEvent(createEvent('keyup', {key: 'enter'}));
        assert.equal(target, undefined);
      });
    });

    suite('keydown', () => {
      test('adds event listener functions for specific keys', () => {
        let id: string = null!;
        let capturedEvent: KeyboardEvent = null!;

        function createListener(_id: string) {
          return (e: KeyboardEvent) => {
            capturedEvent = e;
            id = _id;
          };
        }

        render(
            html`<div (keydown.enter)=${createListener('enter')} (keydown.up)=${createListener('up')}></div>`,
            container);
        const div = container.firstChild as HTMLElement;

        let event = createEvent('keydown', {key: 'enter'});
        div.dispatchEvent(event);

        assert.equal(id, 'enter');
        assert.equal(capturedEvent, event);

        id = null!;
        capturedEvent = null!;

        event = createEvent('keydown', {key: 'up'});
        div.dispatchEvent(event);

        assert.equal(id, 'up');
        assert.equal(capturedEvent, event);
      });

      test('respects modifiers', () => {
        let id: string = null!;
        let capturedEvent: KeyboardEvent = null!;

        function createListener(_id: string) {
          return (e: KeyboardEvent) => {
            capturedEvent = e;
            id = _id;
          };
        }

        render(
            html`<div (keydown.enter)=${createListener('enter')} (keydown.shift.enter)=${
                createListener('shift.enter')}></div>`,
            container);
        const div = container.firstChild as HTMLElement;

        let event = createEvent('keydown', {key: 'enter'});
        div.dispatchEvent(event);

        assert.equal(id, 'enter');
        assert.equal(capturedEvent, event);

        id = null!;
        capturedEvent = null!;

        event = createEvent('keydown', {key: 'enter', shiftKey: true});
        div.dispatchEvent(event);

        assert.equal(id, 'shift.enter');
        assert.equal(capturedEvent, event);
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
        render(html`<div (keydown.enter)=${listener}></div>`, container);
        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keydown', {key: 'enter'}));
        assert.equal(thisValue, listener);
        assert.instanceOf(event, KeyboardEvent);
      });

      test('only adds event listener once', () => {
        let count = 0;
        const listener = () => {
          count++;
        };
        render(html`<div (keydown.enter)=${listener}></div>`, container);
        render(html`<div (keydown.enter)=${listener}></div>`, container);

        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keydown', {key: 'enter'}));
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
        render(html`<div (keydown.enter)=${listener1}></div>`, container);
        render(html`<div (keydown.enter)=${listener2}></div>`, container);

        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keydown', {key: 'enter'}));
        assert.equal(count1, 0);
        assert.equal(count2, 1);
      });

      test('removes event listeners', () => {
        let target;
        let listener: any = (e: any) => target = e.target;
        const t = () => html`<div (keydown.enter)=${listener}></div>`;
        render(t(), container);
        const div = container.firstChild as HTMLElement;
        div.dispatchEvent(createEvent('keydown', {key: 'enter'}));
        assert.equal(target, div);

        listener = null;
        target = undefined;
        render(t(), container);
        assert.equal(container.firstChild, div);
        div.dispatchEvent(createEvent('keydown', {key: 'enter'}));
        assert.equal(target, undefined);
      });
    });
  });
});
