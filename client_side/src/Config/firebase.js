// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth,GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHOy4auA5SnM7M3abKl1NSP6di7SRwtHc",
  authDomain: "hrportalf.firebaseapp.com",
  projectId: "hrportalf",
  storageBucket: "hrportalf.appspot.com",
  messagingSenderId: "383180873230",
  appId: "1:383180873230:web:a8cbe233dac12dd0fda65f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app)
export const auth=getAuth(app)
export const provider=new GoogleAuthProvider()