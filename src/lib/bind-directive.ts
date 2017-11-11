import {directive, DirectiveFn} from '../../lit-html/lit-html.js';

export interface Binding<T> {
  set(value: T): void;
  get(): T;

  __binding: true;
}

export function bind<O extends object, K extends keyof O>(object: O, property: K): DirectiveFn {
  return directive((): Binding<O[K]> => {
    return {
      __binding: true,
      get() {
        return object[property];
      },
      set(value: O[K]) {
        object[property] = value;
      },
    };
  });
}
