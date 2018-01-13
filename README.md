# lit-html-brackets

Extension to [lit-html](https://github.com/PolymerLabs/lit-html) that supports a syntax using brackets, similar to
Angular's templates.

[![Build status](https://travis-ci.org/bgotink/lit-html-brackets.svg?branch=master)](https://travis-ci.org/bgotink/lit-html-brackets)

## Overview

```js
const template = ({ isAuthenticated, login, logout, options, refs }) => html`
  <label>
    <input #rememberMe=${refs} type="checkbox" [(checked::change)]=${bind(options, 'rememberMe')}>
    Remember me?
  </label>

  <button #=${bind(refs, 'loginButton')}
    class="login-cta" [class.login-cta--logged-on]=${isAuthenticated}
    (click)="${isAuthenticated ? logout : login}" (keyup.enter)=${isAuthenticated ? logout : login}
    >
    ${isAuthenticated ? 'Log out' : 'Log in'}
  </button>
`;
```

- Use `[]` in attributes to get property binding
  - Use `[class.foo]` to show/hide the class `foo` depending on the truthiness of the value
  - Use `[style.foo]` to bind the value to to the `foo` style property
- Use `()` in attributes for event binding
  - Listeners for `keyup`/`keydown` support binding to a single key or a key with modifiers, with slightly different
    semantics from Angular.
- Use `[()]` for two way binding. This requires use of the `bind` function.
- Use `#` to get references to the elements. This can be used with `#prop=${object}` where `object.prop` will be set to
  the element instance, or `#name=${callback}` where `callback(elementRef, 'name')` will be called. The `name` can be
  empty.
- The `bind` function which can be used with the three types of bindings.
  - `[prop]=${bind(obj, propName)}`: identical to `[prop]=${obj[propName]}`
  - `(event)=${bind(obj, propName)}`: identical to `(event)=${e => obj[propName] = e.detail}`. This uses
    `CustomEvent#detail` and as such only works for custom events, not for browser events.
  - `[(prop)]=${bind(obj, propName)}`: identical to `[prop]=${obj[propName]}` combined with
    `(prop-changed)=${() => obj[propName] = elementRef.prop}` where `elementRef` is the element on which the property is
    bound.
  - `[(prop::some-event)]=${bind(obj, propName)}`: identical to `[prop]=${obj[propName]}` combined with
    `(some-event)=${() => obj[propName] = elementRef.prop}` where `elementRef` is the element on which the property is
    bound.
  - `#=${bind(obj, propName)}`: identical to `#propName=${obj}`
- All other bindings are left as is, i.e. node bindings are not changed and attributes that don't use `[]` or `()` are
  simply set as attributes.
- The `[]`, `()` and `[()]` syntax only works in attributes with a `${}` value due to how `lit-html` internally works.

## Motivation

- lit-html is awesome but by default it lacks options to set properties or event binding.
- The extension provided by lit-html to introduce a Polymer-like syntax for setting properties and event listeners
  (`property`, `attribute$` and `on-event`) leads to confusing behaviour, which this extension's syntax (`[property]`,
  `attribute` and `(event)`) doesn't:  
  This extension defaults to attributes, so if you don't write `[]` or `()` anywhere you are really just writing
  regular HTML, while the lit-html extension makes you set properties instead of attributes:

  ```js
  /* The following template behaves differently depending on the render function used:
   * - The default `render` exposed by lit-html and the `render` function exposed by lit-html-brackets
   *   will set attributes `a` to `"foo"` and `b` to `"bar"`.
   * - The `render` function exposed by lit-html's extension sets the `a` attribute to `"foo"` but it
   *   sets the `b` property to `"bar"`.
   */
  const template = html`<div a="foo" b=${'bar'}></div>`;
  ```

## Differences with Angular template syntax

- Events listeners should be passed instead of called, that is:

  ```js
  // lit-html-brackets syntax
  html`<div (click)=${onClick}></div>`
  ```

  vs

  ```html
  <!-- angular syntax -->
  <div (click)="onClick($event)"></div>
  ```
- Event listeners can be registered with negative modifiers `noshift`, `noalt`, `nocontrol` and `nometa`. These will
  only fire the listener if the modifier is absent.
- Event listeners are fired even if unspecified modifiers are present. Let's take the example of a listener registered
  to `keyup.enter`. In Angular 5 that listener wouldn't fire for `shift+enter` key-ups. In lit-html-brackets that
  listener will fire. Use `keyup.noshift.enter` to get a listener that doesn't fire when shift is pressed.
- Event listeners in Angular can be bound to window/document events. This is arguably more useful when used with
  Angular's `@HostBinding('window:scroll')` annotation than inside a template `<div (window:scroll)="...">`.
  As such, lit-html-brackets doesn't support these global event listeners.
- Two way binding has to be used with the `bind` function, otherwise it results in one-way binding. This simply because
  we need the object and the property key to create two way binding. In Angular's templates, the object is known: the
  component instance. This is not the case for lit-html-brackets.
