/* eslint-env node */
/* eslint-disable no-console */

import formBodyPlugin from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import pointOfView from '@fastify/view';
import 'dotenv/config';
import ejs from 'ejs';
import Fastify from 'fastify';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import path from 'path';
import { books } from './data.js';

const { OAuth2 } = google.auth;

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { ejs }, root: 'views', layout: '/layouts/layout.ejs' });

fastify.register(formBodyPlugin);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

fastify.register(fastifyStatic, { root: path.join(__dirname, 'public') });

// Register pages
fastify.get('/', (request, reply) => {
    reply.view('/index.ejs', { title: 'Home', script: '', additionalScripts: [] });
});

fastify.get('/books', (request, reply) => {
    reply.view('/pages/books.ejs', { title: 'Books', script: '', additionalScripts: [], books });
});

fastify.get('/contact', (request, reply) => {
    reply.view('/pages/contact.ejs', { title: 'Info & Contact', script: 'contact-form', additionalScripts: [{ src: 'https://www.google.com/recaptcha/api.js', properties: 'async defer' }] });
});

const recaptchaKey = process.env.RECAPTCHA_SECRET_KEY;

const oauth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN }); // eslint-disable-line camelcase

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken()
    }
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
                    } else {
                        return reply.redirect('/contact?result=success');
                    }
                });
            } else {
                return reply.redirect('/contact?result=captcha-failure');
            }
        })
        .catch((error) => {
            console.log(error);
            return reply.redirect('/contact?result=error');
        });
});

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(error.statusCode || 500).view('/error.ejs', { title: 'Internal Server Error', script: '', additionalScripts: [] });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.ejs', { title: 'Not Found', script: '', additionalScripts: [] });
});

// Start server
fastify.listen({ port: process.env.PORT || 3000 }, (error) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
    console.log('Server is now listening on http://localhost:3000');
});
