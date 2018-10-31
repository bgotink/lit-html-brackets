import {RenderOptions} from '../../lit-html/lib/render-options.js';
import {AttributeCommitter, NodePart, Part, TemplateProcessor} from '../../lit-html/lit-html.js';

import {createEventPart} from './event-part';
import {createPropertyCommitter} from './property-part';
import {createRefPart} from './ref-part';
import {createTwoWayPropertyCommitter} from './two-way-part';

// implements, not extends, because we don't want to pull in the entirety of lit-html's syntax at runtime
export class BracketedPartProcessor implements TemplateProcessor {
  handleAttributeExpressions(element: Element, name: string, strings: string[], options: RenderOptions): Part[] {
    if (name.startsWith('[(') && name.endsWith(')]')) {
      const committer = createTwoWayPropertyCommitter(element, name.slice(2, name.length - 2), strings);
      return committer.parts;
    } else if (name.startsWith('[') && name.endsWith(']')) {
      const committer = createPropertyCommitter(element, name.slice(1, name.length - 1), strings);
      return committer.parts;
    } else if (name.startsWith('(') && name.endsWith(')')) {
      return [createEventPart(element, name.slice(1, name.length - 1), strings, options)];
    } else if (name.startsWith('#')) {
      return [createRefPart(element, name.slice(1), strings)];
    }

    const comitter = new AttributeCommitter(element, name, strings);
    return comitter.parts;
  }

  handleTextExpression(options: RenderOptions) {
    return new NodePart(options);
  }
}
