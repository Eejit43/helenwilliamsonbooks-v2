/* eslint-env node */
/* eslint-disable no-console */

import chalk from 'chalk';
import { exec, spawn } from 'child_process';
import { watch } from 'chokidar';
import 'dotenv/config';
import * as readline from 'readline';

readline.emitKeypressEvents(process.stdin);

const config = {
    cwd: '../',
    command: {
        name: 'node',
        args: ['app.js']
    },
    watch: ['js', 'hbs', 'css'].map((ext) => `**/*.${ext}`),
    ignore: '**/node_modules/**'
};

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
    console.log(`${chalk.blue('[Auto Reload]:')}`, ...message);
}

process.on('stdout', (...data) => console.log(...data));

/**
 * Restarts the process
 */
async function restartProcess() {
    logMessage('Restarting...');
    await running.kill();
    spawnProcess();
    await new Promise((resolve) => setTimeout(resolve, 500));
}

/**
 * Stops the process
 */
async function stopProcess() {
    await running.kill();
    logMessage('Killing process...');
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

watch(config.watch).on('change', async () => {
    if (restarting) return;
    restarting = true;
    await restartProcess();
    restarting = false;
});
