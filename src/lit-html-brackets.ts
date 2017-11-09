import {
  defaultPartCallback,
  html,
  Part,
  render as baseRender,
  svg,
  TemplateInstance,
  TemplatePart,
  TemplateResult
} from '../lit-html/lit-html.js';

import {createEventPart} from './lib/event-part.js';
import {createPropertyPart} from './lib/property-part.js';

export {html, svg};

export function render(result: TemplateResult, container: Element|DocumentFragment) {
  baseRender(result, container, bracketsPartCallback);
}

export function bracketsPartCallback(instance: TemplateInstance, templatePart: TemplatePart, node: Node): Part {
  if (templatePart.type !== 'attribute') {
    return defaultPartCallback(instance, templatePart, node);
  }

  const rawName = templatePart.rawName!;

  if (rawName.startsWith('[') && rawName.endsWith(']')) {
    return createPropertyPart(instance, node as Element, rawName.substr(1, rawName.length - 2), templatePart.strings!);
  } else if (rawName.startsWith('(') && rawName.endsWith(')')) {
    return createEventPart(instance, node as Element, rawName.substr(1, rawName.length - 2), templatePart.strings!);
  } else {
    return defaultPartCallback(instance, templatePart, node);
  }
}
