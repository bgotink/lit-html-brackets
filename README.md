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
  - Listeners for `keyup`/`keydown` support binding to a single key or a key with modifiers, with exactly the same
    semantics as Angular 4.
- All other bindings are left as is, i.e. node bindings are not changed and attributes that don't use `[]` or `()` are
  simply set as attributes.
- The `[]` and `()` syntax only works in attributes with a `${}` value due to how `lit-html` internally works.

## Motivation

- `lit-html` is awesome but it lacks options to set properties and event binding instead of attributes
- The bracket syntax used by Angular (`[property]`, `attribute` and `(event)`) has one benefit over Polymer's syntax
  (`property`, `attribute$` and `on-event`, which is exposed by an extension provided
  by `lit-html`)
  - It defaults to attributes, so if you don't write `[]` or `()` anywhere you are really just writing regular HTML,
    while the Polymer syntax makes you set properties instead of attributes.

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
