import compression from 'compression';
import device from 'express-device';
import esteMiddleware from '../lib/esteMiddleware';
import express from 'express';
import favicon from 'serve-favicon';
import render from './render';

const app = express();

app.use(esteMiddleware());
app.use(compression());

app.use(favicon(`${__dirname}/../../../static/favicon.ico`));

// Intl.
app.use('/intl', express.static(`${__dirname}/../../../node_modules/intl/dist`));
app.use('/intl/locale-data', express.static(`${__dirname}/../../../node_modules/intl/locale-data`));
app.use('/', express.static(`${__dirname}/../../../static`, {maxAge: '1d'}));
app.use('/assets', express.static(`${__dirname}/../../../build`, {maxAge: '1d'}));

app.use(device.capture());
app.get('*', render);

app.on('mount', () => {
  console.log('App is available at %s', app.mountpath);
});

export default app;
