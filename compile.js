import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { glob } from 'glob';

const banner = { js: '// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.\n', css: '/* This file was automatically compiled from SCSS. View the original file for a more human-readable version. */\n' };

export async function compileTypescript() {
    return Promise.all([
        build({ entryPoints: await glob('scripts/*.ts'), outdir: 'public/scripts', platform: 'browser', format: 'esm', target: 'es2017', banner }), //
        build({ entryPoints: ['app.ts'], outfile: 'app.js', platform: 'node', format: 'esm', target: 'node20', banner }),
        build({ entryPoints: ['dev.ts'], outfile: 'dev.js', platform: 'node', format: 'esm', target: 'node20', banner }),
        build({ entryPoints: await glob('styles/*.scss'), outdir: 'public/styles', plugins: [sassPlugin()], target: 'es2017', banner })
    ]);
}

compileTypescript();
