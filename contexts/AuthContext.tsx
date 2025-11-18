"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Types pour le contexte d'authentification
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" };

// État initial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

// Contexte
interface AuthContextType {
  state: AuthState;
  actions: {
    checkAuth: () => Promise<void>;
    logout: () => void;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  const checkAuth = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        dispatch({ type: "SET_USER", payload: null });
        router.push("/login");
      } else if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          dispatch({ type: "SET_USER", payload: data.user });
        } else {
          dispatch({ type: "SET_USER", payload: null });
          router.push("/login");
        }
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: "Erreur de vérification d'authentification",
        });
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch({ type: "SET_ERROR", payload: "Erreur de connexion" });
      router.push("/login");
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/login");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const actions = {
    checkAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={{ state, actions }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Composant de protection d'authentification
interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return null; // La redirection est gérée dans le provider
  }

  return <>{children}</>;
}

