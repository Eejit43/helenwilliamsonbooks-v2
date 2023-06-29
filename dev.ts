import chalk from 'chalk';
import { ChildProcess, exec, spawn } from 'child_process';
import { watch } from 'chokidar';
import { consola } from 'consola';
import * as readline from 'readline';
import treeKill from 'tree-kill';
import util from 'util';
// @ts-ignore (better to leave this as JS to reduce startup time)
import { compileTypescript } from './compile.js';

readline.emitKeypressEvents(process.stdin);

const config = {
    command: {
        name: 'railway',
        args: ['run', 'node', '--no-warnings', '--max-old-space-size=100', 'app.js']
    },
    watch: ['ts', 'hbs', 'scss'].map((ext) => `**/*.${ext}`),
    ignore: ['**/node_modules/**', 'dev.ts']
};

const kill = util.promisify(treeKill);

let running: ChildProcess | undefined;

/**
 * Starts the process
 */
async function spawnProcess() {
    await compileTypescript();
    consola.success('Successfully compiled TypeScript and SCSS!');
    running = spawn(config.command.name, config.command.args, { stdio: 'inherit', shell: true });
}

await spawnProcess();

/**
 * Logs a message to the console
 * @param  {...string} message The message(s) to log
 */
function logMessage(...message: string[]) {
    consola.log(`${chalk.blue('[Auto Reload]:')}`, ...message);
}

/**
 * Restarts the process
 */
async function restartProcess() {
    logMessage('Restarting...');
    await kill((running as ChildProcess).pid as number);
    await spawnProcess();
    await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Stops the process
 */
async function stopProcess() {
    logMessage('Killing process...');
    await kill((running as ChildProcess).pid as number);
    process.exit(0);
}

/**
 * Opens the website in the default browser
 */
function openWebsite() {
    logMessage('Opening website...');
    exec(`open http://localhost:${process.env.PORT || 3000}`);
}

process.stdin.resume();

if (process.stdin.isTTY) process.stdin.setRawMode(true);

logMessage('Starting!');
logMessage('Press Ctrl+R to reload, Ctrl+C to stop, and Ctrl+O to open the website');
process.on('exit', () => stopProcess());

process.stdin.on('keypress', (_, key: { ctrl: boolean; name: string }) => {
    if (key.ctrl)
        switch (key.name) {
            case 'c':
                return stopProcess();
            case 'r':
                return restartProcess();
            case 'o':
                return openWebsite();
            default:
        }
});

let restarting = false;

watch(config.watch, { ignored: config.ignore }).on('change', async () => {
    if (restarting) return;
    restarting = true;
    await restartProcess();
    restarting = false;
});
