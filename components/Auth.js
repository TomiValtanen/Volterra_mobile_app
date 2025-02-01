import { Alert } from 'react-native';
import { ref, set, get, child } from 'firebase/database'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth, CARS_REF, db, USERS_REF} from '../firebase/Config'
import { createRef } from 'react';

const navigationRef = createRef();

export const signUp = async (name, email, password, phone, selectedCar) => {
    

    const authorization = getAuth(); 

    try {
        const userCredential = await createUserWithEmailAndPassword(authorization, email, password);
        await set(ref(db, USERS_REF + userCredential.user.uid), {
            name: name,
            email: userCredential.user.email,
            phone: phone,
            car: selectedCar,
        });
        return true;
    } catch (error) {
        console.log("Registration failed.", error.message);
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert("Registration failed. Email is already in use.");
        } else {
            Alert.alert("Registration failed.", error.message);
        }
        return false;
    }
}

export const signIn = async(email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        return true
    }
    catch (error) {
        console.log("Login failed. ", error.message)
        return false
    }
}

export const setTopLevelNavigator = (navigatorRef) => {
    navigationRef.current = navigatorRef;
  };

export const logOut = async(navigationRef) => {
    try {
        const auth = getAuth();
        await signOut(auth)
    }
    catch (error) {
        console.log("Logout error. ", error.message)
        Alert.alert("Logout error. ", error.message)
    }
}


  export const getUserData = async () => {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userId = user.uid;
          const userRef = ref(db, USERS_REF + userId);
  
          get(userRef)
            .then((snapshot) => {
              if (snapshot.exists()) {
                resolve(snapshot.val());
              } else {
                reject(new Error('User data not found.'));
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error('User not authenticated.'));
        }
      });
    });
  };
  
