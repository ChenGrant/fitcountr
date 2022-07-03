import { useEffect, useReducer } from "react";

const ACTIONS = {
  ADD_ASSET: "ADD_ASSET",
  SET_SRC: "SET_SRC",
  SET_LOADING: "SET_LOADING",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_ASSET:
      return { ...state, [action.payload.key]: action.payload.value };
    case ACTIONS.SET_SRC:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          src: action.payload.src,
        },
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          loading: action.payload.loading,
        },
      };
    default:
      return state;
  }
};

const fetchAsset = async (assetName) => {
  const response = await fetch(`/asset/${assetName}`);
  const data = await response.json();
  return data.assetURL;
};

const initializeAssets = (initialAssets) => {
  const assets = {};
  Object.entries(initialAssets).forEach((asset) => {
    const [key, value] = asset;
    const assetName = value.name;
    assets[key] = {
      name: assetName,
      src: "",
      loading: true,
    };
  });
  return assets;
};

const initializeDispatchers = (assets, dispatch) => {
  const dispatchers = {};
  Object.keys(assets).forEach((asset) => {
    dispatchers[asset] = {
      setLoading: (newLoadingStatus) => {
        dispatch({
          type: ACTIONS.SET_LOADING,
          payload: {
            key: asset,
            loading: newLoadingStatus,
          },
        });
      },
    };
  });
  dispatchers["setAllLoading"] = (newLoadingStatus) => {
    Object.keys(assets).forEach((asset) => {
      dispatch({
        type: ACTIONS.SET_LOADING,
        payload: { key: asset, loading: newLoadingStatus },
      });
    });
  };
  return dispatchers;
};

const initializeSrcField = (assets, dispatch) => {
  Object.entries(assets).forEach(async (asset) => {
    const [key, value] = asset;
    if (!assets[key].src) {
      const assetName = value.name;
      const assetURL = await fetchAsset(assetName);
      dispatch({
        type: ACTIONS.SET_SRC,
        payload: {
          key,
          src: assetURL,
        },
      });
    }
  });
};

const useAsset = (input) => {
  const [assets, dispatch] = useReducer(reducer, initializeAssets(input));
  const assetsDispatchers = initializeDispatchers(assets, dispatch);
  const loadingAssets = Object.values(assets).reduce(
    (prev, curr) => prev || curr.loading,
    false
  );

  useEffect(() => initializeSrcField(assets, dispatch), [assets]);

  return { assets, assetsDispatchers, loadingAssets };
};

export default useAsset;
