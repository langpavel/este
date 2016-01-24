import {combineReducers} from 'redux';
import panels from './panelsReducer';
import tree from './treeReducer';

export default combineReducers({
  panels,
  tree,
});
