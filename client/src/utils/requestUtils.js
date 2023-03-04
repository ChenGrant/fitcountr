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

export const fetchFoodFromBarcodeNumber = async (barcodeNumber) =>
  await fetchJSON(`/searchFood/barcodeNumber/${barcodeNumber}`);

export const fetchFoodsFromQuery = async (
  query,
  pageNumber = 1,
  pageSize = 10
) => await fetchJSON(`/searchFood/query/${query}/${pageNumber}/${pageSize}`);

export const fetchAssetURLFromAssetName = async (assetName) =>
  await fetchJSON(`/asset/${assetName}`);

export const fetchProfilePictureURL = async (user) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/profilePicture/${user.firebase.uid}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
  });
};

export const fetchUserProfile = async (user) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/${user.firebase.uid}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
  });
};

export const fetchGoals = async (user) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/goals/${user.firebase.uid}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
  });
};

export const fetchProgress = async (user) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/progress/${user.firebase.uid}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
  });
};

export const fetchFoods = async (user) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/foods/${user.firebase.uid}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
  });
};

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

export const postSignupData = async (firebaseUser, provider) => {
  const userIdToken = await firebaseUser.getIdToken();
  return await fetchJSON(`/user/signup/${firebaseUser.uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify({
      email: firebaseUser.email,
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

export const postProfilePicture = async (user, profilePictureFile) => {
  const userIdToken = await user.firebase.getIdToken();
  const formData = new FormData();
  formData.append("profilePictureFile", profilePictureFile);
  return await fetchJSON(`/user/profilePicture/${user.firebase.uid}`, {
    method: "POST",
    headers: {
      authorization: userIdToken,
    },
    body: formData,
  });
};

export const postProfileData = async (user, profileData) => {
  const userIdToken = await user.firebase.getIdToken();
  const profileDataCopy = { ...profileData };
  if (profileDataCopy.profilePicture) {
    const response = await postProfilePicture(
      user,
      profileDataCopy.profilePicture
    );
    if (response.error) return response;
    delete profileDataCopy.profilePicture;
  }

  return await fetchJSON(`/user/${user.firebase.uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify(profileDataCopy),
  });
};

export const postProgress = async (user, progress) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/progress/${user.firebase.uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify(progress),
  });
};

export const postGoal = async (user, goal) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/goal/${user.firebase.uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify(goal),
  });
};

export const postFood = async (user, food) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/food/${user.firebase.uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify(food),
  });
};

// ----------------------------------- PUT REQUESTS -----------------------------------
export const editProgress = async (user, progress, progressID) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/progress/${user.firebase.uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify({ progressID, progress }),
  });
};

// --------------------------------- DELETE REQUESTS ---------------------------------
export const deleteProgress = async (user, progressID) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/progress/${user.firebase.uid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify({ progressID }),
  });
};

export const deleteFood = async (user, foodID) => {
  const userIdToken = await user.firebase.getIdToken();
  return await fetchJSON(`/user/food/${user.firebase.uid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: userIdToken,
    },
    body: JSON.stringify({ foodID }),
  });
};
