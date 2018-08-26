export interface Binding<T> {
  set(value: T): void;
  get(): T;
}

interface BindingImpl<T> extends Binding<T> {
  __binding: true;
}

export function isBinding(obj: any): obj is Binding<any> {
  return obj != null && (obj as BindingImpl<any>).__binding === true;
}

export function bind<O extends object, K extends keyof O>(object: O, property: K): Binding<O[K]> {
  return {
    __binding: true,
    get() {
      return object[property];
    },
    set(value: O[K]) {
      object[property] = value;
    },
  } as BindingImpl<O[K]>;
}
