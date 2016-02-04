export const SET_SERVER = 'SET_SERVER';

export function setServer({protocol, hostname}) {
  return {
    type: SET_SERVER,
    payload: {protocol, hostname}
  };
}
