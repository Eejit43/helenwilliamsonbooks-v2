import 'dotenv/config';
import createError from 'http-errors';
import debug from 'debug';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import http from 'http';
import path from 'path';

import { books } from './data.js';

const log = debug('helenwilliamsonbooks:server');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

const __dirname = path.dirname(new URL(import.meta.url).pathname); // jshint ignore:line

app.set('port', port);

server.listen(port);

server.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`Port ${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    log(`Listening on ${server.address().port}`);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('json spaces', 2);

app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', script: '', additionalScripts: [] });
});

app.get('/books', (req, res) => {
    res.render('pages/books', { title: 'Books', script: '', additionalScripts: [], books });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', { title: 'Info & Contact', script: 'contact-form', additionalScripts: [{ src: 'https://www.google.com/recaptcha/api.js', properties: 'async defer' }] });
});

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    if (!/NotFoundError: Not Found/.test(err)) console.log(err);

    res.status(err.status || 500);
    res.render('error', { title: err.message.length > 50 ? 'Error' : err.message, message: err.message, error: err, script: '', additionalScripts: [] });
});
