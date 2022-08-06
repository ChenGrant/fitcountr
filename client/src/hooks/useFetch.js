import { useEffect, useReducer } from "react";

const ACTIONS = {
  START_FETCH_REQUEST: "START_FETCH_REQUEST",
  SET_FETCH_SUCCESS: "SET_FETCH_SUCCESS",
  SET_FETCH_FAILURE: "SET_FETCH_FAILURE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.START_FETCH_REQUEST:
      return { ...state, isFetching: true };
    case ACTIONS.SET_FETCH_SUCCESS:
      return {
        isFetching: false,
        hasFetched: true,
        data: action.payload,
        error: undefined,
      };
    case ACTIONS.SET_FETCH_FAILURE:
      return {
        isFetching: false,
        hasFetched: true,
        data: undefined,
        error: action.payload,
      };
    default:
      return state;
  }
};

const startFetchRequest = () => ({ type: ACTIONS.START_FETCH_REQUEST });

const setFetchSuccess = (fetchedData) => ({
  type: ACTIONS.SET_FETCH_SUCCESS,
  payload: fetchedData,
});

const setFetchFailure = (fetchedData) => ({
  type: ACTIONS.SET_FETCH_FAILURE,
  payload: fetchedData,
});

const useFetch = (fetchFunction) => {
  const [data, dispatch] = useReducer(reducer, {
    isFetching: false,
    hasFetched: false,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (data.isFetching || data.hasFetched) return;

    (async () => {
      dispatch(startFetchRequest());

      const fetchedData =
        fetchFunction.constructor.name === "AsyncFunction"
          ? await fetchFunction()
          : fetchFunction();

      if (fetchedData.error)
        return dispatch(setFetchFailure(fetchedData.error));

      dispatch(setFetchSuccess(fetchedData));
    })();
  }, [data.isFetching, data.hasFetched, fetchFunction]);

  return data;
};

export default useFetch;
