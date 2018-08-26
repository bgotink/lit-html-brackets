import {PropertyCommitter} from '../../lit-html/lit-html.js';

import {Binding, isBinding} from './binding.js';

export class TwoWayPropertyCommitter extends PropertyCommitter {
  private _binding: Binding<any>|null = null;

  public constructor(element: Element, property: string, public eventName: string, strings: string[]) {
    super(element, property, strings);
  }

  commit(): void {
    if (this.dirty) {
      this.dirty = false;
      const value = this._getValue();

      if (isBinding(value)) {
        if (this._binding == null) {
          this.element.addEventListener(this.eventName, this);
        }

        this._binding = value;
        (this.element as any)[this.name] = value.get();
      } else {
        if (this._binding != null) {
          this.element.removeEventListener(this.eventName, this);
          this._binding = null;
        }

        (this.element as any)[this.name] = value;
      }
    }
  }

  handleEvent(): void {
    this._binding!.set((this.element as any)[this.name]);
  }
}

export function createTwoWayPropertyCommitter(
    element: Element, property: string, strings: string[]): PropertyCommitter {
  const colonIdx = property.indexOf('::');
  let eventName;

  if (colonIdx > -1) {
    eventName = property.slice(colonIdx + 2);
    property = property.slice(0, colonIdx);
  } else {
    eventName = `${property}-changed`;
  }

  return new TwoWayPropertyCommitter(element, property, eventName, strings);
}
