import {Part} from '../../lit-html/lit-html.js';

import {isBinding} from './binding.js';

export function createRefPart(element: Element, property: string, strings: string[]): Part {
  if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
    throw new Error(`Cannot interpolate references, ${strings.join('${...}')}`);
  }

  return new RefPart(element, property);
}

export class RefPart implements Part {
  value: any = undefined;
  private _dirty = true;

  constructor(private _element: Element, private _property: string) {
  }

  setValue(value: any): void {
    this._dirty = value !== this.value;
    this.value = value;
  }

  commit(): void {
    if (this._dirty) {
      this._dirty = false;
      const value = this.value;

      if (value) {
        if (isBinding(value)) {
          if (value.get() !== this._element) {
            value.set(this._element);
          }
        } else if (typeof value === 'function') {
          value(this._element, this._property);
        } else {
          value[this._property] = this._element;
        }
      }
    }
  }
}
