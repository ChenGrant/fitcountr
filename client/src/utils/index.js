export {
    GMAIL_PROVIDER,
    EMAIL_PASSWORD_PROVIDER,
    fetchEmailProvider,
    fetchEmailIsInUse,
    fetchVerificationStatus,
    fetchFoodFromBarcodeNumber,
    fetchPinLength,
    fetchValidatePin,
    fetchFoodsFromQuery,
    fetchProfilePictureURL,
    fetchUserProfile,
    fetchGoals,
    fetchProgress,
    fetchFoods,
    scanBarcodeImage,
    sendVerificationEmail,
    postSignupData,
    postProfileData,
    postProgress,
    postGoal,
    postFood,
    editProgress,
    deleteProgress,
} from "./requestUtils";

export { sortArray, getLexSmallest } from "./arrayUtils";

export { PROGRESS_TYPES, PROGRESS_TYPE_NAMES } from "./progressUtils";

export { TIME_ZONES, DATE_FORMAT, TIME_FORMAT } from "./dateUtils";

export {
    METRIC,
    IMPERIAL,
    MEASUREMENT_SYSTEMS,
    UNITS,
    WEIGHT_UNITS,
    weightToKilogram,
} from "./measurementUtils";

export {
    numberWithCommas,
    capitalizeFirstCharacter,
    capitalizeOnlyFirstChar,
} from "./stringUtils";

export {
    MAX_HEIGHT,
    MIN_HEIGHT,
    MAX_AGE,
    MIN_WEIGHT,
    SEXES,
    MIN_STEPS,
} from "./humanUtils";

export { sub, round } from "./numberUtils";

export { Stack, NutrientPrioritySet } from "./dataStructureUtils";

export { objectIsEmpty, objectsAreEqual } from "./objectUtils";

export {
    SEARCH_FOOD_PAGES,
    sortByNutrient,
    cleanFoodsFetchedFromQuery,
    cleanFoodsFetchedFromBarcodeNumber,
    getNutrientFromFood,
    MIN_CALORIES,
} from "./foodUtils";

export { theme } from "./themeUtils";

export { firebaseConfig } from "./firebaseUtils";

export { ASSET_SRC } from "./assetUtils";
