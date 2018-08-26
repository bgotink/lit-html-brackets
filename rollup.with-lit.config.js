import filesize from 'rollup-plugin-filesize';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'out-tsc/lit-html-brackets.js',

  onwarn(warning) {
    if (warning.code !== 'CIRCULAR_DEPENDENCY') {
      console.error(`(!) ${warning.message}`);
    }
  },

  plugins: [
    terser({
      warnings: true,
      mangle: {
        module: true,
      },
    }),
    filesize({
      showBrotliSize: true,
    })
  ],

  output: {
    file: 'out-rollup/lit-html-brackets.js',
    format: 'es'
  },
};
