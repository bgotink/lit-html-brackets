import * as path from 'path';

import filesize from 'rollup-plugin-filesize';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'in-rollup/out-tsc/lit-html-brackets.js',

  external: [path.resolve(__dirname, 'in-rollup', 'lit-html', 'lit-html.js')],

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
