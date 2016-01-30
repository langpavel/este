import Helmet from 'react-helmet';
import Html from './Html.react';
import Promise from 'bluebird';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from '../config';
import configureStore from '../../common/configureStore';
import createRoutes from '../../browser/createRoutes';
import serialize from 'serialize-javascript';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {RouterContext, match} from 'react-router';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';

const fetchComponentDataAsync = async (dispatch, renderProps) => {
  const {components, location, params} = renderProps;
  const promises = components
    .reduce((actions, component) =>
      actions.concat(component.fetchActions || [])
    , [])
    .map(action =>
      // Server side fetching can use only router location and params props.
      // There is no easy way how to support custom component props.
      dispatch(action({location, params})).payload.promise
    );
  await Promise.all(promises);
};

const getAppHtml = (store, renderProps) =>
  ReactDOMServer.renderToString(
    <Provider store={store}>
      <IntlProvider>
        <RouterContext {...renderProps} />
      </IntlProvider>
    </Provider>
  );

const getScriptHtml = (state, headers, hostname, appJsFilename) =>
  // Note how app state is serialized. JSON.stringify is anti-pattern.
  // https://github.com/yahoo/serialize-javascript#user-content-automatic-escaping-of-html-characters
  // Note how we use cdn.polyfill.io, en is default, but can be changed later.
  `
    <script src="/intl/dist/Intl.min.js"></script>
    <script src="/intl/locale-data/jsonp/en-US.js"></script>
    <script>
      window.__INITIAL_STATE__ = ${serialize(state)};
    </script>
    <script src="${appJsFilename}"></script>
  `;

const renderPage = (store, renderProps, req) => {
  const state = store.getState();
  const {headers, hostname} = req;
  const appHtml = getAppHtml(store, renderProps);
  const helmet = Helmet.rewind();
  const {
    styles: {app: appCssFilename},
    javascript: {app: appJsFilename}
  } = webpackIsomorphicTools.assets();
  const scriptHtml = getScriptHtml(state, headers, hostname, appJsFilename);
  if (!config.isProduction) {
    webpackIsomorphicTools.refresh();
  }
  const docHtml = ReactDOMServer.renderToStaticMarkup(
    <Html
      appCssFilename={appCssFilename}
      bodyHtml={`<div id="app">${appHtml}</div>${scriptHtml}`}
      googleAnalyticsId={config.googleAnalyticsId}
      helmet={helmet}
      isProduction={config.isProduction}
    />
  );
  return `<!DOCTYPE html>${docHtml}`;
};

export default function render(req, res, next) {
  const initialState = {
    device: {
      isMobile: ['phone', 'tablet'].indexOf(req.device.type) > -1
    }
  };
  const history = createMemoryHistory();
  const location = history.createLocation(req.url);
  const store = configureStore({initialState, history});

  // Fetch logged in user here because routes may need it. Remember we can use
  // store.dispatch method.

  const routes = createRoutes(() => store.getState());

  match({routes, location}, async (error, redirectLocation, renderProps) => {

    if (redirectLocation && (redirectLocation.pathname !== location.pathname)) {
      res.redirect(
        (redirectLocation.state && redirectLocation.state.statusCode) || 303,
        redirectLocation.pathname + redirectLocation.search);
      return;
    }

    if (error) {
      next(error);
      return;
    }

    try {
      await fetchComponentDataAsync(store.dispatch, renderProps);
      const html = renderPage(store, renderProps, req);
      // renderProps are always defined with * route.
      // https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
      let status = 200;

      if (redirectLocation && redirectLocation.state && redirectLocation.state.statusCode)
        status = redirectLocation.state.statusCode;
      else if (renderProps.routes.some(route => route.path === '*'))
        status = 404;

      res.status(status).send(html);
    } catch (e) {
      next(e);
    }
  });
}
