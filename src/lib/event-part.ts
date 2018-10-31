import {RenderOptions} from '../../lit-html/lib/render-options.js';
import {EventPart as LitEventPart, Part} from '../../lit-html/lit-html.js';

import {isBinding} from './binding.js';

export class EventPart extends LitEventPart {
  handleEvent(event: Event) {
    if (isBinding(this.value)) {
      this.value.set((event as CustomEvent).detail);
    } else if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else if (typeof this.value.handleEvent === 'function') {
      this.value.handleEvent(event);
    }
  }
}

/*
 * Keyboard event to string mapping, based on @angular/platform-browser
 */

const DOM_KEY_LOCATION_NUMPAD = 3;

// Map to convert some key or keyIdentifier values to what will be returned by getEventKey
const KEY_MAP: {[k: string]: string} = {
  // The following values are here for cross-browser compatibility and to match the W3C standard
  // cf http://www.w3.org/TR/DOM-Level-3-Events-key/
  '\b': 'Backspace',
  '\t': 'Tab',
  '\x7F': 'Delete',
  '\x1B': 'Escape',
  'Del': 'Delete',
  'Esc': 'Escape',
  'Left': 'ArrowLeft',
  'Right': 'ArrowRight',
  'Up': 'ArrowUp',
  'Down': 'ArrowDown',
  'Menu': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'Win': 'OS'
};

// There is a bug in Chrome for numeric keypad keys:
// https://code.google.com/p/chromium/issues/detail?id=155654
// 1, 2, 3 ... are reported as A, B, C ...
const CHROME_NUM_KEYPAD_MAP = {
  'A': '1',
  'B': '2',
  'C': '3',
  'D': '4',
  'E': '5',
  'F': '6',
  'G': '7',
  'H': '8',
  'I': '9',
  'J': '*',
  'K': '+',
  'M': '-',
  'N': '.',
  'O': '/',
  '\x60': '0',
  '\x90': 'NumLock'
};

const MODIFIER_KEYS = ['alt', 'control', 'meta', 'shift'];
const MODIFIER_KEY_GETTERS: {[key: string]: (event: KeyboardEvent) => boolean} = {
  alt: (event: KeyboardEvent) => event.altKey,
  control: (event: KeyboardEvent) => event.ctrlKey,
  meta: (event: KeyboardEvent) => event.metaKey,
  shift: (event: KeyboardEvent) => event.shiftKey
};

function normalizeKey(keyName: string): string {
  switch (keyName) {
    case 'esc':
      return 'escape';
    default:
      return keyName;
  }
}

function getEventKey(event: KeyboardEvent): string {
  let key = event.key;
  if (key == null) {
    key = (event as any).keyIdentifier;
    // keyIdentifier is defined in the old draft of DOM Level 3 Events implemented by Chrome and
    // Safari cf
    // http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-KeyboardEvents-Interfaces
    if (key == null) {
      return 'unidentified';
    }
    if (key.startsWith('U+')) {
      key = String.fromCharCode(parseInt(key.substring(2), 16));
      if (event.location === DOM_KEY_LOCATION_NUMPAD && CHROME_NUM_KEYPAD_MAP.hasOwnProperty(key)) {
        // There is a bug in Chrome for numeric keypad keys:
        // https://code.google.com/p/chromium/issues/detail?id=155654
        // 1, 2, 3 ... are reported as A, B, C ...
        key = (CHROME_NUM_KEYPAD_MAP as any)[key];
      }
    }
  }

  key = (KEY_MAP[key] || key).toLowerCase();

  if (key === ' ') {
    key = 'space';  // for readability
  } else if (key === '.') {
    key = 'dot';  // because '.' is used as a separator in event names
  }

  return key;
}

export class FilteredKeyboardEventPart extends EventPart {
  private readonly _eventKey: string;

  private readonly _modifiers: string[];
  private readonly _negativeModifiers: string[];

  constructor(element: Element, eventName: string, filter: string[], eventTarget?: EventTarget) {
    super(element, eventName, eventTarget);

    this._eventKey = normalizeKey(filter.pop()!);
    this._modifiers = [];
    this._negativeModifiers = [];

    MODIFIER_KEYS.forEach(modifierName => {
      let index = filter.indexOf(modifierName);
      if (index > -1) {
        filter.splice(index, 1);
        this._modifiers.push(modifierName);
      }

      index = filter.indexOf(`no${modifierName}`);
      if (index > -1) {
        filter.splice(index, 1);
        this._negativeModifiers.push(modifierName);
      }
    });

    if (filter.length) {
      throw new Error(`Unknown modifiers: ${filter.join('.')}`);
    }
  }

  public handleEvent(event: KeyboardEvent): void {
    if (getEventKey(event) !== this._eventKey) {
      return;
    }

    for (const modifier of this._modifiers) {
      if (!MODIFIER_KEY_GETTERS[modifier](event)) {
        return;
      }
    }

    for (const modifier of this._negativeModifiers) {
      if (MODIFIER_KEY_GETTERS[modifier](event)) {
        return;
      }
    }

    super.handleEvent(event);
  }
}

export function createEventPart(element: Element, eventName: string, strings: string[], options: RenderOptions): Part {
  // Events can be registered like this:
  //   (click)=${listener}
  // or
  //   (click)="${listener}"
  // but never like this
  //   (click)="on${listener}"

  if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
    throw new Error(`Cannot bind events to interpolations: "${strings.join('${...}')}"`);
  }

  const parts: string[] = eventName.toLowerCase().split('.');

  const domEventName = parts.shift();
  if ((parts.length !== 0) && (domEventName === 'keydown' || domEventName === 'keyup')) {
    return new FilteredKeyboardEventPart(element, domEventName, parts, options.eventContext);
  }

  return new EventPart(element, eventName, options.eventContext);
}
