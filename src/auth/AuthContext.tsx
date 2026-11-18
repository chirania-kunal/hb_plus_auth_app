import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { isAllowedEmail } from '../config';

type AppRole = 'admin' | 'user';
type AuthContextValue = {
  user: User | null;
  role: AppRole;
  loading: boolean;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    try {
      if (!firebaseUser) {
        setUser(null);
        setRole('user');
        return;
      }
      // Client-side guard improves UX. The blocking function and Firestore rules
      // provide the actual server-side enforcement described in README.
      if (!isAllowedEmail(firebaseUser.email) || !firebaseUser.emailVerified) {
        await signOut(auth);
        setUser(null);
        setRole('user');
        return;
      }
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName ?? '',
          photoURL: firebaseUser.photoURL ?? '',
          role: 'user',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Never accept a role from the client during profile updates.
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      }
      const fresh = await getDoc(userRef);
      setRole(fresh.data()?.role === 'admin' ? 'admin' : 'user');
      setUser(firebaseUser);
    } catch (error) {
      console.error('Unable to initialize user session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }), []);

  const value = useMemo(() => ({ user, role, loading, logout: () => signOut(auth) }), [user, role, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
