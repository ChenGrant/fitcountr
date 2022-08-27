import { PROGRESS_TYPE_NAMES } from "../../utils";
import {
  INITIALIZE_USER,
  RESET_USER,
  SET_AUTHENTICATING_USER,
  SET_USER_PROFILE,
  SET_USER_FIREBASE_DATA,
  SET_USER_PROFILE_PICTURE_IS_LOADING,
  SET_USER_PROFILE_PICTURE_URL,
  SET_VERIFICATION_STATUS,
  SET_USER_GOALS,
  SET_USER_PROGRESS,
  ADD_USER_PROGRESS_ITEM,
  REMOVE_USER_PROGRESS_ITEM,
  EDIT_USER_PROGRESS_ITEM,
  SET_USER_FOODS,
  ADD_USER_FOOD,
} from "./userTypes";

// uses binary search in the future
const getInsertIndex = (array, target) => {
  for (let i = 0; i < array.length; i++) {
    if (target >= array[i]) return i;
  }
  return array.length;
};

// requires allProgress to be sorted by date from most recent to least recent
const addProgressItem = (allProgress, { progressType, progressItem }) => {
  const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;

  const insertIndex = getInsertIndex(
    allProgress[singularProgressType].map((item) => new Date(item.date)),
    new Date(progressItem.date)
  );

  return {
    [singularProgressType]: [
      ...allProgress[singularProgressType].slice(0, insertIndex),
      progressItem,
      ...allProgress[singularProgressType].slice(insertIndex),
    ],
  };
};

const removeProgressItem = (allProgress, { progressItemID, progressType }) => {
  const singularProgressType = PROGRESS_TYPE_NAMES[progressType].singular;
  return {
    [singularProgressType]: allProgress[singularProgressType].filter(
      ({ id }) => id !== progressItemID
    ),
  };
};

const editProgressItem = (
  allProgress,
  { progressItem, progressItemID, progressType }
) => {
  return addProgressItem(
    removeProgressItem(allProgress, {
      progressItemID,
      progressType,
    }),
    { progressType, progressItem }
  );
};

const initialState = {
  auth: {
    isInitialized: false,
    isAuthenticating: false,
    isVerified: null,
    isLoggedIn: false,
  },
  firebase: null,
  profilePicture: {
    URL: null,
    isLoading: true,
  },
  profile: null,
  goals: null,
  progress: null,
  foods: null,
};

const userReducer = (state = initialState, action) => {
  const user = (() => {
    switch (action.type) {
      case INITIALIZE_USER:
        return { ...state, auth: { ...state.auth, isInitialized: true } };

      case RESET_USER:
        return {
          ...initialState,
          auth: {
            ...initialState.auth,
            isInitialized: state.auth.isInitialized,
          },
        };

      case SET_USER_FIREBASE_DATA:
        return { ...state, firebase: action.payload };

      case SET_AUTHENTICATING_USER:
        return {
          ...state,
          auth: { ...state.auth, isAuthenticating: action.payload },
        };

      case SET_VERIFICATION_STATUS:
        return {
          ...state,
          auth: { ...state.auth, isVerified: action.payload === "Verified" },
        };

      case SET_USER_PROFILE_PICTURE_URL:
        return {
          ...state,
          profilePicture: {
            ...state.profilePicture,
            URL: action.payload,
          },
        };

      case SET_USER_PROFILE_PICTURE_IS_LOADING:
        return {
          ...state,
          profilePicture: {
            ...state.profilePicture,
            isLoading: action.payload,
          },
        };

      case SET_USER_PROFILE:
        return {
          ...state,
          profile: {
            ...state.profile,
            ...action.payload,
          },
        };

      case SET_USER_GOALS:
        return {
          ...state,
          goals: {
            ...state.goals,
            ...action.payload,
          },
        };

      case SET_USER_PROGRESS:
        return {
          ...state,
          progress: action.payload,
        };

      case ADD_USER_PROGRESS_ITEM:
        return {
          ...state,
          progress: {
            ...state.progress,
            ...addProgressItem(state.progress, action.payload),
          },
        };

      case REMOVE_USER_PROGRESS_ITEM:
        return {
          ...state,
          progress: {
            ...state.progress,
            ...removeProgressItem(state.progress, action.payload),
          },
        };

      case EDIT_USER_PROGRESS_ITEM:
        return {
          ...state,
          progress: {
            ...state.progress,
            ...editProgressItem(state.progress, action.payload),
          },
        };

      case SET_USER_FOODS:
        return {
          ...state,
          foods: action.payload,
        };

      case ADD_USER_FOOD:
        return {
          ...state,
          foods: {
            ...state.foods,
            ...action.payload,
          },
        };
      default:
        return state;
    }
  })();

  user.auth.isLoggedIn =
    user.auth.isInitialized &&
    user.auth.isVerified !== null &&
    user.auth.isVerified &&
    user.firebase !== null;

  return user;
};

export default userReducer;
