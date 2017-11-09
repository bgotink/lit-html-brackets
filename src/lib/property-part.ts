import {AttributePart, getValue, Part, TemplateInstance} from '../../lit-html/lit-html.js';

export function createPropertyPart(
    instance: TemplateInstance, element: Element, property: string, strings: string[]): Part {
  if (property.startsWith('class.')) {
    return new ClassPropertyPart(instance, element, property.substr(6), strings);
  } else if (property.startsWith('style.')) {
    return new StylePropertyPart(instance, element, property.substr(6), strings);
  } else {
    return new RegularPropertyPart(instance, element, property, strings);
  }
}

export abstract class PropertyPart extends AttributePart {
  protected abstract doSetValue(value: any): void;

  setValue(values: any[], startIndex: number): void {
    const s = this.strings;
    let value: any;

    if (s.length === 2 && s[0] === '' && s[s.length - 1] === '') {
      value = getValue(this, values[startIndex]);
    } else {
      value = this._interpolate(values, startIndex);
    }

    this.doSetValue(value);
  }
}

export class RegularPropertyPart extends PropertyPart {
  doSetValue(value: any): void {
    (this.element as any)[this.name] = value;
  }
}

export class ClassPropertyPart extends PropertyPart {
  doSetValue(value: any): void {
    this.element.classList.toggle(this.name, !!value && value !== 'false');
  }
}

export class StylePropertyPart extends PropertyPart {
  constructor(instance: TemplateInstance, element: Element, property: string, strings: string[]) {
    super(instance, element, property, strings);

    if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
      throw new Error('Style interpolation can only be used on HTML elements or SVG elements');
    }
  }

  doSetValue(value: any): void {
    if (value == null) {
      value = '';
    }

    ((this.element as HTMLElement | SVGElement).style as any)[this.name] = value;
  }
}
