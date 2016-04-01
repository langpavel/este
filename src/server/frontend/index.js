import compression from 'compression';
import esteMiddleware from '../lib/esteMiddleware';
import express from 'express';
import favicon from 'serve-favicon';
import render from './render';

const app = express();

app.use(esteMiddleware());
app.use(compression());

app.use(favicon(`${__dirname}/../../../static/favicon.ico`));

// All assets must be handled via require syntax like this:
// <img alt="50x50 placeholder" src={require('./50x50.png')} />
app.use('/assets', express.static('build', { maxAge: '200d' }));

// Intl.
app.use('/intl', express.static(`${__dirname}/../../../node_modules/intl/dist`));
app.use('/intl/locale-data', express.static(`${__dirname}/../../../node_modules/intl/locale-data`));
app.use('/', express.static(`${__dirname}/../../../static`, {maxAge: '1d'}));

app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
