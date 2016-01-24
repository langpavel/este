import {Map, fromJS} from 'immutable';
import Stat from './Stat';
import * as actions from './actions';
import {PATH_SEP} from './constants';
import {pathToStorePath} from './utils';

const initialState = Map({
  // root entry
  '/': Map() // Entry()
});

const fromJSON = (json) => {
  const reviver = (key, value) => {
    switch (key) {
      case 'stat':
        return new Stat(value);
      default:
        return Map(value);
    }
  };
  return fromJS(json, reviver);
};

export default function treeReducer(state = initialState, action) {
  if (!Map.isMap(state)) return fromJSON(state);

  switch (action.type) {

    // case actions.FETCH_LS_START:
    // case actions.FETCH_LS_ERROR:
    case actions.FETCH_LS_SUCCESS: {
      const {payload} = action;
      const {realPath} = payload;
      const path = realPath.split(PATH_SEP);

      const updatePath = pathToStorePath('/', path, 'entries');
      return state.updateIn(updatePath, (old) =>
        Map(payload.entries.reduce((entries, entry) => {
          entries[entry] = old ? old.get(entry, Map()) : Map();
          return entries;
        }, {})));
    }

    // case actions.FETCH_STAT_START:
    // case actions.FETCH_STAT_ERROR:
    case actions.FETCH_STAT_SUCCESS: {
      const {payload} = action;
      return state.mergeDeep(
        Map(payload.stats).reduce((state, stat, realPath) => {
          const path = realPath.split(PATH_SEP);
          const updatePath = pathToStorePath('/', path, 'stat');
          return state.setIn(updatePath, new Stat(stat));
        }, Map())
      );
    }

    default: {
      return state;
    }
  }
}
