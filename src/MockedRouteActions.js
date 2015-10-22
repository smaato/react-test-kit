
// Copied from redux-router constants.js.
const constants = {
  HISTORY_API: '@@reduxReactRouter/historyAPI',
};

function createRouteAction(method, state, pathname, query) {
  const args = [state, pathname];
  if (query !== undefined) {
    args.push(query);
  }
  return {
    type: constants.HISTORY_API,
    payload: {
      method: method,
      args: args,
    },
  };
}

export default {

  replaceState: function replaceState(state, pathname, query) {
    return createRouteAction('replaceState', state, pathname, query);
  },

  pushState: function pushState(state, pathname, query) {
    return createRouteAction('pushState', state, pathname, query);
  },

};
