import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const sveltePreprocess = require('svelte-preprocess');
const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: !production
			},
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
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),

		// Common js converts JS to ES6 for svelte
		commonjs(),

		// Serve is to automatically rerurn start script when dev server rebuilds
		!production && serve(),

		// Livereload watches project and rebuilds when there is a change
		!production && livereload('public'),

		// Terser is for uglyfying in production
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
