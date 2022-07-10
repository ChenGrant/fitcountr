import { useEffect, useReducer } from "react";

const ACTIONS = {
  ADD_ASSET: "ADD_ASSET",
  SET_SRC: "SET_SRC",
  SET_IS_LOADING: "SET_IS_LOADING",
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

    case ACTIONS.SET_IS_LOADING:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          isLoading: action.payload.isLoading,
        },
      };

    default:
      return state;
  }
};

// given an assetName, this function fetches the URL for that asset
const fetchAssetURLFromAssetName = async (assetName) => {
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
      isLoading: true,
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
          type: ACTIONS.SET_IS_LOADING,
          payload: {
            key: asset,
            isLoading: newLoadingStatus,
          },
        });
      },
    };
  });
  dispatchers["setAllLoading"] = (newLoadingStatus) => {
    Object.keys(assets).forEach((asset) => {
      dispatch({
        type: ACTIONS.SET_IS_LOADING,
        payload: { key: asset, isLoading: newLoadingStatus },
      });
    });
  };
  return dispatchers;
};

// if the 'src' property for any asset has a value of "",
// populate the 'src' property with the assetURL fetched from the server
const populateSrcField = (assets, dispatch) => {
  Object.entries(assets).forEach(async (asset) => {
    const [key, value] = asset;
    if (!assets[key].src) {
      const assetName = value.name;
      const assetURL = await fetchAssetURLFromAssetName(assetName);
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

// ----------------------------------- CUSTOM HOOK -----------------------------------

// given an object in the following form, this hook returns an array with three items.
// {asset1 : {name : asset1Name}, asset2: {name : asset2Name}, etc...}

// The first item provides each asset's src and loading status.
// The first item is provided in the following form:
// {
//   asset1 : {
//     name : asset1Name,
//     src : asset1Src,
//     isLoading: asset1IsLoading
//   },
//   asset2 : {
//     name : asset1Name,
//     src : asset1Src,
//     isLoading: asset1IsLoading
//   },
//   etc...
// }

// The second item provides functions for each asset that set the asset's loading state.
// It also provides a function to set loading state for all assets.
// The second item is provided in the following form:
// {
//   asset1: { setLoading : asset1SetLoadingFunction },
//   asset2: { setLoading : asset2SetLoadingFunction },
//   setAllLoading : setLoadingALlFunction
//   etc...
// }

// The third item is a boolean variable that is true if at least one of the assets'
// 'isLoading' property is true. Otherwise the third item is false.
const useAsset = (input) => {
  // assets is first item in the array that this hook returns
  const [assets, dispatch] = useReducer(reducer, initializeAssets(input));
  // assetsDispatchers is second item in the array that this hook returns
  const assetsDispatchers = initializeDispatchers(assets, dispatch);
  // loadingAssets is third item in the array that this hook returns
  const loadingAssets = Object.values(assets).some((asset) => asset.isLoading);

  const fetchingAssetSources = Object.values(assets).some(
    (asset) => asset.src === ""
  );

  // populate the src field from a value of "" to their corresponding src URL
  useEffect(() => populateSrcField(assets, dispatch), [assets]);

  return [assets, assetsDispatchers, loadingAssets, fetchingAssetSources];
};

export default useAsset;
