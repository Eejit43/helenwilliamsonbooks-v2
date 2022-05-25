/* eslint-env node */

import fastifyStatic from '@fastify/static';
import 'dotenv/config';
import ejs from 'ejs';
import Fastify from 'fastify';
import path from 'path';
import pointOfView from 'point-of-view';
import { books } from './data.js';

// Load layouts and static assets
const fastify = Fastify();

fastify.register(pointOfView, { engine: { ejs }, root: 'views', layout: '/layouts/layout.ejs' });

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

// Setup error handlers
fastify.setErrorHandler((error, request, reply) => {
    console.log(error);
    reply.status(error.statusCode || 500).view('/error.ejs', { title: error.message.length > 50 ? 'Internal Server Error' : error.message, message: error.message, error, script: '', additionalScripts: [] });
});

fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).view('/error.ejs', { title: 'Not Found', message: 'Not Found', error: '', script: '', additionalScripts: [] });
});

// Start server
fastify.listen({ port: process.env.PORT || 3000 }, (error) => {
    if (error) {
        fastify.log.error(error);
        process.exit(1);
    }
    console.log('Server is now listening on http://localhost:3000');
});
