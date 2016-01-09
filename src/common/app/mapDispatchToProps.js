import * as authActions from '../auth/actions';
import * as todosActions from '../todos/actions';
import * as uiActions from '../ui/actions';
import {routeActions} from 'redux-simple-router';
import {Map} from 'immutable';
import {bindActionCreators} from 'redux';

const actions = [
  routeActions,
  authActions,
  todosActions,
  uiActions
];

export default function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}
