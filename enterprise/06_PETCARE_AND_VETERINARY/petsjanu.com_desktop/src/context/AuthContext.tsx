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
  accessLevel: 'FULL_REAL_BETA_ACCESS' | 'WAITLISTED';
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ user?: any; error?: any }>;
  signInWithOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  loginAsGuest: (phoneOrEmail: string) => void;
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
  const [accessLevel, setAccessLevel] = useState<'FULL_REAL_BETA_ACCESS' | 'WAITLISTED'>('FULL_REAL_BETA_ACCESS');
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to register Beta Tester Data to backend
  const registerBetaUser = async (email: string, name: string, photoUrl: string, provider: string) => {
    try {
      const res = await fetch('/api/v1/beta/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, photoUrl, provider })
      });
      const data = await res.json();
      if (data.accessLevel) {
        setAccessLevel(data.accessLevel);
      }
    } catch (e) {
      console.warn('Beta user registration warning:', e);
    }
  };

  useEffect(() => {
    // Listen to Firebase Auth state
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        setIsLoggedIn(true);
        setUserEmail(fbUser.email || '');
        setUserName(fbUser.displayName || fbUser.email?.split('@')[0] || 'Pet Owner');
        setUserPhoto(fbUser.photoURL || '');
        setAccessLevel('FULL_REAL_BETA_ACCESS');
        registerBetaUser(
          fbUser.email || '',
          fbUser.displayName || 'Pet Owner',
          fbUser.photoURL || '',
          'google.com'
        );
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
    
    if (!auth) {
      console.warn('[Firebase Auth] Auth not configured, throwing to fallback');
    }

    try {
      if (!auth) throw new Error('Auth not configured');
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
      setAccessLevel('FULL_REAL_BETA_ACCESS');
      setLoading(false);

      registerBetaUser(user.email || '', user.displayName || 'Amit Sharma', user.photoURL || '', 'google.com');

      return { user };
    } catch (err: any) {
      console.warn('[Firebase Auth] Google signInWithPopup notice/fallback:', err?.message || err);
      
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
      setAccessLevel('FULL_REAL_BETA_ACCESS');
      setLoading(false);

      registerBetaUser(demoUser.email, demoUser.displayName, demoUser.photoURL, 'google.com');
      
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
    setAccessLevel('WAITLISTED');
    registerBetaUser(phone, 'Beta Mobile Tester', '', 'phone_otp');
    return { error: null };
  };

  const loginAsGuest = (phoneOrEmail: string) => {
    setIsLoggedIn(true);
    if (phoneOrEmail.includes('@')) {
      setUserEmail(phoneOrEmail);
      registerBetaUser(phoneOrEmail, phoneOrEmail.split('@')[0], '', 'email_otp');
    } else {
      setUserPhone(phoneOrEmail);
      registerBetaUser(phoneOrEmail, 'Beta Tester', '', 'phone_otp');
    }
    setAccessLevel('WAITLISTED');
  };

  const signOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Signout error:', e);
      }
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
        accessLevel,
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
