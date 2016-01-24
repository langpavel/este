import {PATH_SEP} from './constants';

export const FETCH_LS = '@@explorer/FETCH_LS';
export const FETCH_LS_ERROR = '@@explorer/FETCH_LS_ERROR';
export const FETCH_LS_START = '@@explorer/FETCH_LS_START';
export const FETCH_LS_SUCCESS = '@@explorer/FETCH_LS_SUCCESS';

export const FETCH_STAT = '@@explorer/FETCH_STAT';
export const FETCH_STAT_ERROR = '@@explorer/FETCH_STAT_ERROR';
export const FETCH_STAT_START = '@@explorer/FETCH_STAT_START';
export const FETCH_STAT_SUCCESS = '@@explorer/FETCH_STAT_SUCCESS';

export function fetchDir(props) {
  const {path} = props;
  const fetchPath = path.map(encodeURIComponent).join(PATH_SEP);
  return ({fetch}) => ({
    type: FETCH_LS,
    payload: {
      promise: fetch('api/v1/explorer/ls/' + fetchPath)
        .then(response => response.json())
    },
    meta: {
      path
    }
  });
}

export function fetchStat(props) {
  const {path} = props;
  return ({fetch}) => ({
    type: FETCH_STAT,
    payload: {
      promise: fetch('api/v1/explorer/stat/' + encodeURIComponent(path))
        .then(response => response.json())
    },
    meta: {
      path
    }
  });
}
