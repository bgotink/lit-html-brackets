import {AttributePart, getValue, Part, TemplateInstance} from '../../lit-html/lit-html.js';
import {Binding} from './bind-directive.js';

export function createTwoWayPart(
    instance: TemplateInstance, element: Element, property: string, strings: string[]): Part {
  const colonIdx = property.indexOf('::');
  let eventName;

  if (colonIdx > -1) {
    eventName = property.slice(colonIdx + 2);
    property = property.slice(0, colonIdx);
  } else {
    eventName = `${property}-changed`;
  }

  return new TwoWayPropertyPart(instance, element, property, eventName, strings);
}

export class TwoWayPropertyPart extends AttributePart {
  private _binding: Binding<any>|null = null;

  public constructor(
      instance: TemplateInstance,
      element: Element,
      property: string,
      public eventName: string,
      strings: string[]) {
    super(instance, element, property, strings);
  }

  setValue(values: any[], startIndex: number): void {
    const s = this.strings;
    let value: any;

    if (s.length === 2 && s[0] === '' && s[s.length - 1] === '') {
      value = getValue(this, values[startIndex]);
    } else {
      value = this._interpolate(values, startIndex);
    }

    if (value != null && (value as Binding<any>).__binding) {
      this._setBindingValue(value as Binding<any>);
    } else {
      this._setSimpleValue(value);
    }
  }

  private _setSimpleValue(value: any): void {
    if (this._binding != null) {
      this.element.removeEventListener(this.eventName, this);
      this._binding = null;
    }

    (this.element as any)[this.name] = value;
  }

  private _setBindingValue(value: Binding<any>): void {
    if (this._binding == null) {
      this.element.addEventListener(this.eventName, this);
    }

    this._binding = value;
    (this.element as any)[this.name] = value.get();
  }

  handleEvent(): void {
    this._binding!.set((this.element as any)[this.name]);
  }
}
