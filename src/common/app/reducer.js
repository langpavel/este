import {combineReducers} from 'redux';
import {reduxFields} from '../lib/redux-fields';

import auth from '../auth/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import server from '../server/reducer';
import todos from '../todos/reducer';
import ui from '../ui/reducer';
import users from '../users/reducer';
import {routeReducer as routing} from 'react-router-redux';

const appReducer = combineReducers({
  auth,
  device,
  intl,
  reduxFields,
  routing,
  server,
  todos,
  ui,
  users
});

export default appReducer;
