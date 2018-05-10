export interface Binding<T> {
  set(value: T): void;
  get(): T;

  __binding: true;
}

export function isBinding(obj: any): obj is Binding<any> {
  return typeof obj === 'object' && (obj as Binding<any>).__binding === true;
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
  };
}
