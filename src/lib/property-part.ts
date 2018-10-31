import {PropertyCommitter as LitPropertyComitter} from '../../lit-html/lit-html.js';

import {isBinding} from './binding.js';

export class PropertyCommitter extends LitPropertyComitter {
  _getValue(): any {
    const value = super._getValue();

    if (isBinding(value)) {
      return value.get();
    }

    return value;
  }
}

export class ClassPropertyCommitter extends PropertyCommitter {
  commit() {
    if (this.dirty) {
      this.dirty = false;
      const value = this._getValue();

      this.element.classList.toggle(this.name, !!value && value !== 'false');
    }
  }
}

export class StylePropertyCommitter extends PropertyCommitter {
  constructor(element: Element, name: string, strings: string[]) {
    super(element, name, strings);

    if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
      throw new Error('Style interpolation can only be used on HTML elements or SVG elements');
    }
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      const value = this._getValue();

      ((this.element as HTMLElement | SVGElement).style as any)[this.name] = value;
    }
  }
}

export function createPropertyCommitter(element: Element, property: string, strings: string[]): PropertyCommitter {
  if (property.startsWith('class.')) {
    return new ClassPropertyCommitter(element, property.substr(6 /* "class.".length */), strings);
  } else if (property.startsWith('style.')) {
    return new StylePropertyCommitter(element, property.substr(6 /* "style.".length */), strings);
  }
  return new PropertyCommitter(element, property, strings);
}
