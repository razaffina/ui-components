import css from 'rollup-plugin-css-only';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import sveltePreprocess from "svelte-preprocess";

const pkg = require('./package.json');
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: [
      { file: pkg.main, 'format': 'umd', name: 'TabLink' }
  ],
  plugins: [
    svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        postcss: {
          plugins: [
             require("tailwindcss"),
             require("autoprefixer"),
             require("postcss-nesting")
          ],
        },
      }),
    }),
    css({ output: 'bundle.css' }),
    resolve()
  ]
}
