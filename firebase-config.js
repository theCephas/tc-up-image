import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdBcqbvVLIN7Y1qWQc1TM83Zcp0XrJdQw",
  authDomain: "tc-up-image.firebaseapp.com",
  projectId: "tc-up-image",
  storageBucket: "tc-up-image.appspot.com",
  messagingSenderId: "145107718021",
  appId: "1:145107718021:web:71cf7649926511b118beec",
  measurementId: "G-YV7NQZHXE5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
