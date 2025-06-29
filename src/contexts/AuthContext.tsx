import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  userType?: 'student' | 'teacher' | 'visitor';
  department?: string;
  status?: 'active' | 'inactive' | 'pending';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Pierre Dupont',
    email: 'pierre.dupont@esst.edu',
    role: 'admin',
    userType: 'teacher',
    department: 'Administration',
    status: 'active'
  });

  const login = async (email: string, password: string) => {
    // Simulation d'une connexion avec différents comptes de démonstration
    let mockUser: User;
    
    if (email.includes('admin')) {
      mockUser = {
        id: '1',
        name: 'Pierre Dupont',
        email: email,
        role: 'admin',
        userType: 'teacher',
        department: 'Administration',
        status: 'active'
      };
    } else if (email.includes('enseignant') || email.includes('teacher')) {
      mockUser = {
        id: '2',
        name: 'Marie Dubois',
        email: email,
        role: 'teacher',
        userType: 'teacher',
        department: 'Intelligence Artificielle',
        status: 'active'
      };
    } else {
      mockUser = {
        id: '3',
        name: 'Sophie Laurent',
        email: email,
        role: 'student',
        userType: 'student',
        department: 'Master Data Science',
        status: 'active'
      };
    }
    
    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
  };

  const register = async (userData: any) => {
    // Simulation d'une inscription
    const newUser: User = {
      id: Date.now().toString(),
      name: `${userData.firstname} ${userData.lastname}`,
      email: userData.email,
      role: userData.userType === 'teacher' ? 'teacher' : 
            userData.userType === 'student' ? 'student' : 'student',
      userType: userData.userType,
      department: userData.faculty || userData.program || userData.organization,
      status: userData.userType === 'visitor' ? 'pending' : 'active'
    };
    
    // Simulation d'un délai d'inscription
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Auto-login après inscription
    setUser(newUser);
    
    // Simulation d'un email de confirmation
    console.log('Email de confirmation envoyé à:', userData.email);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};