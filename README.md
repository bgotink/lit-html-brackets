# lit-html-brackets

Extension to [lit-html](https://github.com/PolymerLabs/lit-html) that supports a syntax using brackets, similar to
Angular's templates.

__Note__: This library currently requires a build of lit-html that hasn't been published yet. You'll need to manually
build the lit-html master branch and `npm link` it to this repository for the tests to succeed.

## Overview

```js
const template = ({ isAuthenticated, login, logout }) => html`
  <button
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
- All other bindings are left as is, i.e. node bindings are not changed and attributes that don't use `[]` or `()` are
  simply set as attributes.
- The `[]` and `()` syntax only works in attributes with a `${}` value due to how `lit-html` internally works.

## Motivation

- lit-html is awesome but by default it lacks options to set properties and event binding instead of attributes
- The extension provided by lit-html to introduce a Polymer-like syntax for setting attributes and event listeners
  (`property`, `attribute$` and `on-event`) leads to confusing behaviour. This extension's syntax (`[property]`,
  `attribute` and `(event)`) doesn't suffer from the same confusion.  
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
- Event listeners are fired even if unqualified modifiers are present. Let's take the example of a listener registered
  to `keyup.enter`. In Angular 5 that listener wouldn't fire for `shift+enter` key-ups. In lit-html-brackets that
  listener will fire. Use `keyup.noshift.enter` to get a listener that doesn't fire when shift is pressed.
