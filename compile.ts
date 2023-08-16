import { BuildOptions, build } from 'esbuild';
import postcss from 'esbuild-postcss';
import { cpSync } from 'node:fs';

const banner = {
    js: '// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.\n',
    css: '/* This file was automatically compiled from modern CSS. View the original file for a more human-readable version. */\n',
};

const buildParameters: Record<string, BuildOptions> = {
    node: { platform: 'node', format: 'esm', target: 'node20', sourcemap: true, banner },
    browser: { platform: 'browser', format: 'esm', target: 'es2017', sourcemap: true, banner },
    css: { plugins: [postcss()], sourcemap: true, banner },
};

/**
 * Compiles all TypeScript files into JavaScript.
 */
export async function compileTypescript() {
    await Promise.all([
        // Main files
        build({ entryPoints: ['development.ts'], outfile: 'development.js', ...buildParameters.node }),
        build({ entryPoints: ['src/*.ts'], outdir: 'dist', ...buildParameters.node }),

        // Scripts
        build({ entryPoints: ['src/public/scripts/*.ts'], outdir: 'dist/public/scripts', ...buildParameters.browser }),

        // CSS
        build({ entryPoints: ['src/public/styles/*.css'], outdir: 'dist/public/styles', ...buildParameters.css }),
    ]);

    // Copy views folder
    cpSync('src/views', 'dist/views', { recursive: true });

    // Copy external styles
    cpSync('src/public/styles/external', 'dist/public/styles/external', { recursive: true });

    // Copy favicons folder
    cpSync('src/public/favicons', 'dist/public/favicons', { recursive: true });
    cpSync('src/public/apple-touch-icon.png', 'dist/public/apple-touch-icon.png', { recursive: true });
    cpSync('src/public/favicon.ico', 'dist/public/favicon.ico', { recursive: true });

    // Copy images
    cpSync('src/public/images', 'dist/public/images', { recursive: true });

    // Copy books data
    cpSync('src/books-data.json', 'dist/books-data.json', { recursive: true });
}

await compileTypescript();
