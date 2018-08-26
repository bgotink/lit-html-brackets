import * as path from 'path';

import filesize from 'rollup-plugin-filesize';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'out-tsc/lit-html-brackets.js',

  external: [path.resolve(__dirname, 'lit-html', 'lit-html.js')],

  plugins:
      [
        terser({
          warnings: true,
          mangle: {
            module: true,
          },
        }),
        filesize({
          showBrotliSize: true,
        }),
      ],

  output: {
    file: 'out-rollup/lit-html-brackets.js',
    format: 'es',
  },
};
