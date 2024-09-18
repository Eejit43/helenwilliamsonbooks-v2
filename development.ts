import chalk from 'chalk';
import { watch } from 'chokidar';
import { consola } from 'consola';
import { ChildProcess, exec, execSync, spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import * as readline from 'node:readline';
import { promisify } from 'node:util';
import treeKill from 'tree-kill';
import { compileTypescript } from './compile.js';

readline.emitKeypressEvents(process.stdin);

const config = {
    command: {
        name: 'railway',
        args: 'run node --no-warnings --enable-source-maps dist/app.js'.split(' '),
    },
    watch: ['ts', 'hbs', 'css'],
    ignored: ['node_modules', 'dist', '.git', 'development.ts'],
};

const kill = promisify(treeKill);

let running: ChildProcess;

/**
 * Starts the process.
 */
async function spawnProcess() {
    rmSync('dist', { recursive: true, force: true });
    await compileTypescript();
    consola.success('Successfully compiled TypeScript and CSS!');
    running = spawn(config.command.name, config.command.args, { stdio: 'inherit', shell: true });
}

await spawnProcess();

/**
 * Logs a message to the console.
 * @param message The message(s) to log.
 */
function logMessage(...message: string[]) {
    consola.log(`${chalk.blue('[Auto Reload]:')}`, ...message);
}

/**
 * Restarts the process.
 */
async function restartProcess() {
    logMessage('Restarting...');
    await kill(running.pid!);
    await spawnProcess();
    await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Stops the process.
 */
function stopProcess() {
    logMessage('Killing process...');
    execSync('pnpm run remove-compiled');
    process.exit(0); // eslint-disable-line unicorn/no-process-exit
}

/**
 * Opens the website in the default browser.
 */
function openWebsite() {
    logMessage('Opening website...');
    exec(`open http://localhost:${process.env.PORT ?? 3000}`);
}

process.stdin.resume();

if (process.stdin.isTTY) process.stdin.setRawMode(true);

logMessage('Starting!');
logMessage('Press Ctrl+R to reload, Ctrl+C to stop, and Ctrl+O to open the website');

process.stdin.on('keypress', (string, key: { ctrl: boolean; name: string }) => {
    if (key.ctrl)
        switch (key.name) {
            case 'c': {
                return stopProcess();
            }
            case 'r': {
                return restartProcess();
            }
            case 'o': {
                return openWebsite();
            }
            default:
        }
});

let restarting = false;

const watcher = watch('.', {
    ignored: (path, stats) => {
        if (config.ignored.includes(path)) return true;
        if (!stats?.isFile()) return false;

        if (config.watch.some((extension) => path.endsWith(extension))) return false;
        return true;
    },
});

watcher.on('change', async () => {
    if (restarting) return;
    restarting = true;
    await restartProcess();
    restarting = false;
});
