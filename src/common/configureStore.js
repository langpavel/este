import appReducer from './app/reducer';
import createFetch from './createFetch';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import shortid from 'shortid';
import validate from './validate';
import {applyMiddleware, compose, createStore} from 'redux';
import {syncHistory} from 'redux-simple-router';

const BROWSER_DEVELOPMENT =
  process.env.NODE_ENV !== 'production' &&
  process.env.IS_BROWSER;

// TODO: Add example for browser/native redux-storage.
// import storage from 'redux-storage';
export default function configureStore({deps, /* engine, */ initialState, history}) {
  // Server address is passed in environment var WEB_ADDR defaulted to
  // 'http://localhost:8000' for mobile device or '' for browser/server
  // platforms (e.g. treat as relative URL to current page).
  const webAddr = process.env.WEB_ADDR ||
    (initialState.device.isMobile ? 'http://localhost:8000' : '');

  // Este dependency injection middleware. So simple that we don't need a lib.
  // It's like mixed redux-thunk and redux-inject.
  const injectMiddleware = deps => store => next => action => {
    return next(typeof action === 'function'
      ? action({...deps, store})
      : action
    );
  };

  const middleware = [
    injectMiddleware({
      ...deps,
      fetch: createFetch(webAddr),
      getUid: () => shortid.generate(),
      now: () => Date.now(),
      validate
    }),
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
    })
  ];

  let historyMiddleware;
  if (history) {
    historyMiddleware = syncHistory(history);
    middleware.push(historyMiddleware);
  }

  // TODO: Add redux-storage example.
  // if (engine) {
  //   // The order of decorators is important.
  //   engine = storage.decorators.filter(engine, [
  //     ['todos']
  //   ]);
  //   engine = storage.decorators.debounce(engine, 1500);
  //   middleware.push(storage.createMiddleware(engine));
  // }

  if (BROWSER_DEVELOPMENT) {
    const logger = createLogger({
      // Immutable introspection:
      // For Chrome 47+ there is custom formatter in browser/devTool.js.
      // Check Enable Custom Formatters option in Developer Tools/
      // Settings/General/Console.
      // For Firefox there are extensions too.
      // stateTransformer: state => JSON.parse(JSON.stringify(state)),
      collapsed: true
    });
    // Logger must be the last middleware in chain.
    middleware.push(logger);
  }

  const createReduxStore = (BROWSER_DEVELOPMENT && window.devToolsExtension)
    ? compose(applyMiddleware(...middleware), window.devToolsExtension())
    : applyMiddleware(...middleware);
  const store = createReduxStore(createStore)(appReducer, initialState);

  if (historyMiddleware) {
    historyMiddleware.syncHistoryToStore(store);
  }

  // Enable hot reload where available.
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./app/reducer', () => {
      const nextAppReducer = require('./app/reducer');
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
