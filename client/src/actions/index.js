import axios from "axios";
import { FETCH_USER } from "./types";

// if thunk see we return func here, thunk will call this func and pass dispatch as arg
// dispatch action after promise is resolved
export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

// send token, which is from Stripe API when user checkout, to express server
export const handleToken = token => async dispatch => {
  const res = await axios.post("/api/stripe", token);
  dispatch({ type: FETCH_USER, payload: res.data });
};
