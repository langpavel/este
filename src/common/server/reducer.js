import * as actions from './actions';
import {Record} from 'immutable';

class ServerRecord extends Record({
  protocol: 'http',
  hostname: 'localhost.localdomain'
}) {
  getDomains() {
    return this.get('hostname').split('.').reverse();
  }
}
const initialState = new ServerRecord;

export default function serverReducer(state = initialState, action) {
  if (!(state instanceof ServerRecord)) return initialState.merge(state);

  switch (action.type) {

    case actions.SET_SERVER: {
      const {protocol, hostname} = action.payload;
      return state.withMutations(server => {
        server.set('protocol', protocol);
        server.set('hostname', hostname);
        return server;
      });
    }

  }

  return state;
}
