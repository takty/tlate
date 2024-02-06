import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

await build({
	entryPoints : ['src/tlate.ts'],
	plugins     : [sassPlugin()],
	outdir      : 'dist',
	outExtension: { '.js': '.min.js', '.css': '.min.css' },
	minify      : true,
	sourcemap   : true,
});
