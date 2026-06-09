import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { auth, googleProvider, db, trackEvent } from '../firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Load user profile from Firestore
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const profile = profileDoc.exists() ? profileDoc.data() : {};
        setCity(profile.city || null);
        setUser(firebaseUser);
      } else {
        setUser(null);
        setCity(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      trackEvent('login', { method: 'google' });

      // Create/update user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastSeen: serverTimestamp(),
      }, { merge: true });

      return result.user;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
    trackEvent('logout');
  }, []);

  const updateCity = useCallback(async (newCity) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), { city: newCity, updatedAt: serverTimestamp() }, { merge: true });
    setCity(newCity);
    trackEvent('city_selected', { city: newCity });
  }, [user]);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, city, signIn, signOut: signOutUser, updateCity } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
