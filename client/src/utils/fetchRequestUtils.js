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
