// given a user object and a email verification provider string, a POST
// request is sent to the server to the '/signup' endpoint and this function
// returns the json data that the server responds with
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