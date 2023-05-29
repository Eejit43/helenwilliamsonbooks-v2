/* eslint-env node */
/* eslint-disable no-console */

import chalk from 'chalk';
import { exec, spawn } from 'child_process';
import { watch } from 'chokidar';
import { consola } from 'consola';
import * as readline from 'readline';
import treeKill from 'tree-kill';
import util from 'util';

readline.emitKeypressEvents(process.stdin);

const config = {
    command: {
        name: 'railway',
        args: ['run', 'node', '--max-old-space-size=100', 'app.js']
    },
    watch: ['js', 'hbs', 'scss'].map((ext) => `**/*.${ext}`),
    ignore: ['**/node_modules/**', 'dev.js']
};

const kill = util.promisify(treeKill);

let running;

/**
 * Starts the process
 */
function spawnProcess() {
    running = spawn(config.command.name, config.command.args, { stdio: 'inherit', shell: true });
}

spawnProcess();

/**
 * Logs a message to the console
 * @param  {...string} message The message(s) to log
 */
function logMessage(...message) {
    consola.log(`${chalk.blue('[Auto Reload]:')}`, ...message);
}

/**
 * Restarts the process
 */
async function restartProcess() {
    logMessage('Restarting...');
    await kill(running.pid);
    spawnProcess();
    await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Stops the process
 */
async function stopProcess() {
    logMessage('Killing process...');
    await kill(running.pid);
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

process.stdin.on('keypress', (_, key) => {
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
