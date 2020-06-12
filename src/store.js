import { createStore } from "redux";
// import produce from "immer";

let reducer = (state, action) => {
  if (action.type === "register") {
    return { ...state, login: action.login, HATEOAS: action.HATEOAS };
  }
  if (action.type === "login") {
    return { ...state, login: action.login, HATEOAS: action.HATEOAS };
  }

  return state;
};

const store = createStore(
  reducer,
  {
    login: false,
    HATEOAS: undefined,
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
