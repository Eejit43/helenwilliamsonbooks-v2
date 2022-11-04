/* eslint-env node */

import formBodyPlugin from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import chalk from 'chalk';
import 'dotenv/config';
import Fastify from 'fastify';
import handlebars from 'handlebars';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import path from 'path';
import { books } from './data.js';

// Add Handlebars helper functions
handlebars.registerHelper('equals', (a, b) => a === b);
handlebars.registerHelper('both', (a, b) => a && b);

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { handlebars }, root: 'views', includeViewExtension: true, layout: '/layouts/layout' });

fastify.register(formBodyPlugin);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

fastify.register(fastifyStatic, { root: path.join(__dirname, 'public') });

// Register pages
fastify.get('/', (request, reply) => reply.view('/index', { title: 'Home', additionalScripts: [] }));

fastify.get('/books', (request, reply) => reply.view('/pages/books', { title: 'Books', additionalScripts: [], books }));

fastify.get('/contact', (request, reply) => reply.view('/pages/contact', { title: 'Info & Contact', script: 'contact-form', additionalScripts: [{ link: 'https://www.google.com/recaptcha/api.js', properties: 'async defer' }] }));

const recaptchaKey = process.env.RECAPTCHA_SECRET_KEY;

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

/**
 * Escapes HTML syntax in a string
 * @param {string} input String to be modified
 * @returns {string} Formatted string
 */
export function escapeHtml(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

fastify.post('/contact/submit', (request, reply) => {
    const { name, email, message } = request.body;

    const responseKey = request.body['g-recaptcha-response'];

    const html = [
        '<div style="font-family: \'Verdana\', sans-serif; color: #20242c">',
        '<h1>New <a href="https://www.helenwilliamsonbooks.com/contact" target="_blank">Contact Form</a> Submission:</h1>',
        '<div style="background-color: #3f92ff; padding: 10px; max-width: 80%; border-radius: 10px">',
        `<p><strong>Name:</strong> <span style="background-color: #7588b5; border-radius: 5px; padding: 5px; display: inline-block; min-width: 20px;">${escapeHtml(name)}</span></p>`, //
        `<p><strong>Email:</strong> <span style="background-color: #7588b5; border-radius: 5px; padding: 5px; display: inline-block; min-width: 20px;">${escapeHtml(email)}</span></p>`,
        '<p><strong>Message:</strong></p>',
        `<div style="background-color: #7588b5; border-radius: 5px; padding: 5px">${escapeHtml(message)}</div>`,
        '<br />',
        `<p><strong>Sent At:</strong> ${new Date().toLocaleTimeString([], { timeZone: 'America/New_York' })}, ${new Date().toLocaleDateString([], { timeZone: 'America/New_York' })} (EST)</p>`,
        '</div>',
        '</div>'
    ].join('');

    const mailOptions = {
        from: `"Helen Williamson Books" <${process.env.EMAIL_USER}>`,
        to: process.env.DESTINATION_EMAIL,
        cc: process.env.CARBON_COPY_EMAIL,
        subject: 'Contact form submission - Helen Williamson Books',
        html
    };

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaKey}&response=${responseKey}`, { method: 'post' })
        .then((response) => response.json())
        .then((googleResponse) => {
            if (googleResponse.success) {
                transport.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.log(error);
                        return reply.redirect('/contact?result=error');
                    } else return reply.redirect('/contact?result=success');
                });
            } else return reply.redirect('/contact?result=captcha-failure');
        })
        .catch((error) => {
            console.log(error);
            return reply.redirect('/contact?result=error');
        });
});

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(error.statusCode || 500).view('/error', { title: 'Internal Server Error', additionalScripts: [] });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error', { title: 'Not Found', additionalScripts: [] });
});

const port = process.env.PORT || 3000;

// Start server
fastify.listen({ port, host: '0.0.0.0' }, (error) => {
    if (error) {
        if (error.code === 'EADDRINUSE') console.log(`${chalk.red('[Startup error]:')} Port ${chalk.yellow(port)} is already in use!`);
        else console.log(`${chalk.red('[Startup error]:')} ${error}`);
        process.exit(1);
    }

    console.log(`${chalk.green('Server is now listening on port')} ${chalk.yellow(port)}${process.env.NODE_ENV !== 'production' ? ` (${chalk.blueBright(`http://localhost:${port}`)})` : ''}`);
});
