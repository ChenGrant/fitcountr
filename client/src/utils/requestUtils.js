// ------------------------------------ CONSTANTS ------------------------------------
export const GMAIL_PROVIDER = "GMAIL_PROVIDER";

export const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";

// ----------------------------------- GET REQUESTS -----------------------------------
const fetchJSON = async (resource, options) => {
  try {
    const response = await fetch(resource, options);
    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    console.log(err);
  }
};

export const fetchFirebaseClientConfig = async () =>
  await fetchJSON(`/firebaseClientConfig`);

export const fetchEmailProvider = async (email) =>
  await fetchJSON(`/emailVerification/provider/${email}`);

export const fetchEmailIsInUse = async (email) =>
  await fetchJSON(`/emailVerification/emailInUse/${email}`);

export const fetchVerificationStatus = async (email) =>
  await fetchJSON(`/emailVerification/verificationStatus/${email}`);

export const fetchPinLength = async (email) =>
  await fetchJSON(`/emailVerification/pinLength/${email}`);

export const fetchNutritionFromBarcodeNumber = async (barcodeNumber) =>
  await fetchJSON(`/searchFood/barcodeNumber/${barcodeNumber}`);

export const fetchFoodsFromQuery = async (
  query,
  pageNumber = 1,
  pageSize = 10
) => await fetchJSON(`/searchFood/query/${query}/${pageNumber}/${pageSize}`);

export const fetchAssetURLFromAssetName = async (assetName) =>
  await fetchJSON(`/asset/${assetName}`);

// ---------------------------------- POST REQUESTS ----------------------------------
export const sendVerificationEmail = async (email) =>
  await fetchJSON(`/emailVerification/sendVerificationEmail/${email}`, {
    method: "POST",
  });

export const fetchValidatePin = async (email, pin) =>
  await fetchJSON("/emailVerification/validatePin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      pin,
    }),
  });

export const postSignupData = async (user, provider) => {
  const userIdToken = await user.getIdToken();
  return await fetchJSON("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify({
      user,
      provider,
    }),
  });
};

export const scanBarcodeImage = async (barcodeImageFile) => {
  const formData = new FormData();
  formData.append("barcodeImageFile", barcodeImageFile);
  return await fetchJSON(`/searchFood/scanBarcodeImage`, {
    method: "POST",
    body: formData,
  });
};