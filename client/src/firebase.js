import { initializeApp } from "firebase/app";

const initializeFirebaseClient = async () => {
  const response = await fetch("/firebaseclientconfig");
  const firebaseClientConfig = await response.json();
  initializeApp(firebaseClientConfig);
};

export { initializeFirebaseClient };
