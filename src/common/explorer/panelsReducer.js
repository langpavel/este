// import * as actions from './actions';
import {List, Record} from 'immutable';

const PanelInfo = Record({
  path: List(),
  realPath: List()
}, 'PanelInfo');

const initialState = List([
  new PanelInfo({
    path: List(['home', 'langpavel', 'Projects', 'serveradmin']),
    realPath: List(['home', 'langpavel', 'Projects', 'serveradmin'])
  })
]);

const fromJSON = (json) => List(
  (json || []).map(
    panelInfo => new PanelInfo(panelInfo)));

export default function panelsReducer(state = initialState, action) {
  if (!List.isList(state)) return fromJSON(state);

  switch (action.type) {
    default: {
      return state;
    }
  }

}
