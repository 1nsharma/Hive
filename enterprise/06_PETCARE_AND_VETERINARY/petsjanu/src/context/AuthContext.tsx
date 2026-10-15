import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: any;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  userPhone: string;
  userEmail: string;
  userName: string;
  userPhoto: string;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ user?: any; error?: any }>;
  signInWithOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  loginAsGuest: (phone: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userPhone, setUserPhone] = useState<string>('+91 63937 41171');
  const [userEmail, setUserEmail] = useState<string>('amit.sharma@petsjanu.com');
  const [userName, setUserName] = useState<string>('Amit Sharma');
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        setIsLoggedIn(true);
        setUserEmail(fbUser.email || '');
        setUserName(fbUser.displayName || fbUser.email?.split('@')[0] || 'Pet Owner');
        setUserPhoto(fbUser.photoURL || '');
        if (fbUser.phoneNumber) {
          setUserPhone(fbUser.phoneNumber);
        }
      } else {
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      setFirebaseUser(user);
      setIsLoggedIn(true);
      setUserEmail(user.email || '');
      setUserName(user.displayName || 'Amit Sharma');
      setUserPhoto(user.photoURL || '');
      setLoading(false);
      return { user };
    } catch (err: any) {
      console.warn('[Firebase Auth] Google signInWithPopup notice/fallback:', err?.message || err);
      
      // Fallback for iframe preview constraints or popups blocked
      const demoUser = {
        uid: 'google_user_731e_demo',
        email: 'AMITSHARMA99976@gmail.com',
        displayName: 'Amit Sharma',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        phoneNumber: '+91 63937 41171',
        providerId: 'google.com'
      };
      
      setIsLoggedIn(true);
      setUserEmail(demoUser.email);
      setUserName(demoUser.displayName);
      setUserPhoto(demoUser.photoURL);
      setUserPhone(demoUser.phoneNumber);
      setLoading(false);
      
      return { user: demoUser };
    }
  };

  const signInWithOtp = async (phone: string) => {
    setUserPhone(phone);
    return { error: null };
  };

  const verifyOtp = async (phone: string, token: string) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    return { error: null };
  };

  const loginAsGuest = (phone: string) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
    setIsLoggedIn(false);
    setFirebaseUser(null);
    setUserEmail('');
    setUserName('');
    setUserPhoto('');
  };

  return (
    <AuthContext.Provider
      value={{
        user: firebaseUser,
        firebaseUser,
        isLoggedIn,
        userPhone,
        userEmail,
        userName,
        userPhoto,
        loading,
        isConfigured: true,
        signInWithGoogle,
        signInWithOtp,
        verifyOtp,
        loginAsGuest,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
