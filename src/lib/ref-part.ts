import {AttributePart, getValue, Part, TemplateInstance} from '../../lit-html/lit-html.js';

import {isBinding} from './binding.js';

export function createRefPart(instance: TemplateInstance, element: Element, property: string, strings: string[]): Part {
  return new RefPart(instance, element, property, strings);
}

export class RefPart extends AttributePart {
  private _previousValue: any = undefined;

  constructor(instance: TemplateInstance, element: Element, property: string, strings: string[]) {
    super(instance, element, property, strings);

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error(`Cannot interpolate references, ${strings.join('${...}')}`);
    }
  }

  setValue(values: any[], startIndex: number): void {
    const value = getValue(this, values[startIndex]);

    if (value && value !== this._previousValue) {
      if (isBinding(value)) {
        if (value.get() !== this.element) {
          value.set(this.element);
        }
      } else if (typeof value === 'function') {
        value(this.element, this.name);
      } else {
        value[this.name] = this.element;
      }
    }

    this._previousValue = value;
  }
}
