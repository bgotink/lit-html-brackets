import * as path from 'path';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
 input: 'out-tsc/lit-html-brackets.js',

 external: [
   path.resolve(__dirname, 'lit-html', 'lit-html.js'),
 ],

 plugins: [
   sourcemaps(),
 ],

 output: {
   file: 'out-rollup/lit-html-brackets.js',
   format: 'es',
   sourcemap: true,
 }
};
