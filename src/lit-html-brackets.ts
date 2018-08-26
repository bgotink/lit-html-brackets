import {
  render,
  SVGTemplateResult,
  TemplateResult,
} from '../lit-html/lit-html.js';

import {BracketedPartProcessor} from './lib/part-processor';

export {bind} from './lib/binding.js';
export {BracketedPartProcessor, render};

export const partProcessor = new BracketedPartProcessor();

export const html = (strings: TemplateStringsArray, ...values: any[]) =>
    new TemplateResult(strings, values, 'html', partProcessor);

export const svg = (strings: TemplateStringsArray, ...values: any[]) =>
    new SVGTemplateResult(strings, values, 'svg', partProcessor);
