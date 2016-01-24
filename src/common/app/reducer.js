import {combineReducers} from 'redux';

// Note we are composing all reducers. Web, native, whatever. Of course we can
// pass platform specific reducers in configureStore, but there is no reason to
// do that, until app is really large.
import auth from '../auth/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import todos from '../todos/reducer';
import ui from '../ui/reducer';
import users from '../users/reducer';
import explorer from '../explorer/reducer';
import {routeReducer as routing} from 'redux-simple-router';

const appReducer = combineReducers({
  auth,
  device,
  intl,
  routing,
  todos,
  ui,
  users,
  explorer
});

export default appReducer;
