import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersistentState } from '../utils/imageStorage';

export interface AdminUser {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AdminContextType {
  isAdmin: boolean;
  currentAdmin: AdminUser | null;
  registerAdmin: (name: string, email: string, password: string) => { success: boolean; message: string };
  loginAdmin: (email: string, password: string) => { success: boolean; message: string };
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  registeredAdminsCount: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_USERS_STORAGE_KEY = 'kkn_admin_users_v2';
const CURRENT_ADMIN_STORAGE_KEY = 'kkn_current_admin_v2';

const DEFAULT_ADMIN: AdminUser = {
  name: 'Admin Utama KKN',
  email: 'admin@masoem.ac.id',
  password: 'admin',
  createdAt: new Date().toISOString(),
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved admin users with Firebase Firestore real-time sync
  const [adminUsers, setAdminUsers] = usePersistentState<AdminUser[]>(
    ADMIN_USERS_STORAGE_KEY,
    [DEFAULT_ADMIN]
  );

  // Current logged-in admin user
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_ADMIN_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync current admin to localStorage
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem(CURRENT_ADMIN_STORAGE_KEY, JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem(CURRENT_ADMIN_STORAGE_KEY);
    }
  }, [currentAdmin]);

  const isAdmin = currentAdmin !== null;

  const registerAdmin = (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, message: 'Nama lengkap wajib diisi!' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Format email tidak valid!' };
    }
    if (!password || password.length < 4) {
      return { success: false, message: 'Password minimal 4 karakter!' };
    }

    // Check if email already registered
    const existing = adminUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Email ini sudah terdaftar sebagai admin! Silakan Masuk (Login).' };
    }

    const newUser: AdminUser = {
      name: cleanName,
      email: cleanEmail,
      password: password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...adminUsers, newUser];
    setAdminUsers(updatedUsers);
    setCurrentAdmin(newUser);

    return { success: true, message: `Akun admin ${cleanName} berhasil dibuat!` };
  };

  const loginAdmin = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail) {
      return { success: false, message: 'Masukkan email admin Anda!' };
    }
    if (!password) {
      return { success: false, message: 'Masukkan password admin Anda!' };
    }

    const user = adminUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (user) {
      setCurrentAdmin(user);
      return { success: true, message: `Selamat datang kembali, ${user.name}!` };
    }

    return {
      success: false,
      message: 'Email atau password admin salah. Belum punya akun? Silakan klik tab Daftar.',
    };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        currentAdmin,
        registerAdmin,
        loginAdmin,
        logoutAdmin,
        isLoginModalOpen,
        setIsLoginModalOpen,
        registeredAdminsCount: adminUsers.length,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
