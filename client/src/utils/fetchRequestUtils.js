// ------------------------------------ CONSTANTS ------------------------------------
export const GMAIL_PROVIDER = "GMAIL_PROVIDER";

export const EMAIL_PASSWORD_PROVIDER = "EMAIL_PASSWORD_PROVIDER";

// ----------------------------------- GET REQUESTS -----------------------------------
export const fetchFirebaseClientConfig = async () => {
  const response = await fetch(`/firebaseClientConfig`);
  const data = await response.json();
  return data;
};

export const fetchEmailProvider = async (email) => {
  const response = await fetch(`/emailVerification/provider/${email}`);
  const data = await response.json();
  return data;
};

export const fetchEmailIsInUse = async (email) => {
  const response = await fetch(`/emailVerification/emailInUse/${email}`);
  const data = await response.json();
  return data;
};

export const fetchVerificationStatus = async (email) => {
  const response = await fetch(
    `/emailVerification/verificationStatus/${email}`
  );
  const data = await response.json();
  return data;
};

export const fetchPinLength = async (email) => {
  const response = await fetch(`/emailVerification/pinLength/${email}`);
  const data = await response.json();
  return data;
};

export const fetchNutritionFromBarcodeNumber = async (barcodeNumber) => {
  const response = await fetch(`/searchFood/barcodeNumber/${barcodeNumber}`);
  const data = await response.json();
  return data;
};

export const fetchFoodListFromName = async (
  name,
  pageNumber = 1,
  pageSize = 10
) => {
  const response = await fetch(
    `/searchFood/name/${name}/${pageNumber}/${pageSize}`
  );
  const data = await response.json();
  return data;
};

export const fetchAssetURLFromAssetName = async (assetName) => {
  const response = await fetch(`/asset/${assetName}`);
  const data = await response.json();
  return data.assetURL;
};

// ---------------------------------- POST REQUESTS ----------------------------------
export const sendVerificationEmail = async (email) => {
  const response = await fetch(
    `/emailVerification/sendVerificationEmail/${email}`,
    { method: "POST" }
  );
  const data = await response.json();
  return data;
};

export const fetchValidatePin = async (email, pin) => {
  const response = await fetch("/emailVerification/validatePin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, pin }),
  });
  const data = await response.json();
  return data;
};

export const postSignupData = async (user, provider) => {
  const userIdToken = await user.getIdToken();
  const response = await fetch("/signup", {
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
  const data = await response.json();
  return data;
};

export const scanBarcodeImage = async (barcodeImageFile) => {
  const formData = new FormData();
  formData.append("barcodeImageFile", barcodeImageFile);
  const response = await fetch(`/searchFood/scanBarcodeImage`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
};
