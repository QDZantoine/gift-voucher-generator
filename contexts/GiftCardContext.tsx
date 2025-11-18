"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { GiftCardWithUser, GiftCardStatus } from "@/lib/types/gift-card";

// Types pour le contexte
interface GiftCardState {
  giftCards: GiftCardWithUser[];
  loading: boolean;
  error: string | null;
  status: GiftCardStatus | "all";
  search: string;
  page: number;
  totalPages: number;
}

type GiftCardAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_GIFT_CARDS";
      payload: { giftCards: GiftCardWithUser[]; totalPages: number };
    }
  | { type: "SET_STATUS"; payload: GiftCardStatus | "all" }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "RESET_FILTERS" };

// État initial
const initialState: GiftCardState = {
  giftCards: [],
  loading: false,
  error: null,
  status: "all",
  search: "",
  page: 1,
  totalPages: 1,
};

// Reducer
function giftCardReducer(
  state: GiftCardState,
  action: GiftCardAction
): GiftCardState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_GIFT_CARDS":
      return {
        ...state,
        giftCards: action.payload.giftCards,
        totalPages: action.payload.totalPages,
        loading: false,
        error: null,
      };
    case "SET_STATUS":
      return { ...state, status: action.payload, page: 1 };
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "RESET_FILTERS":
      return { ...state, status: "all", search: "", page: 1 };
    default:
      return state;
  }
}

// Contexte
interface GiftCardContextType {
  state: GiftCardState;
  actions: {
    setStatus: (status: GiftCardStatus | "all") => void;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
    retry: () => void;
  };
}

const GiftCardContext = createContext<GiftCardContextType | undefined>(
  undefined
);

// Provider
interface GiftCardProviderProps {
  children: ReactNode;
}

export function GiftCardProvider({ children }: GiftCardProviderProps) {
  const [state, dispatch] = useReducer(giftCardReducer, initialState);

  // Fonction de fetch stable
  const fetchGiftCards = useCallback(
    async (status: GiftCardStatus | "all", search: string, page: number) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const params = new URLSearchParams();
        if (status !== "all") params.append("status", status);
        if (search) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", "10");

        const response = await fetch(`/api/gift-cards?${params}`);

        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.warn("Failed to parse error response:", parseError);
          }

          console.error("API Error:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });

          if (response.status === 401) {
            throw new Error("Session expirée. Veuillez vous reconnecter.");
          } else if (response.status === 500) {
            throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
          } else {
            const errorMessage =
              (errorData as { error?: string })?.error ||
              `Erreur ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
          }
        }

        const data = await response.json();
        dispatch({
          type: "SET_GIFT_CARDS",
          payload: {
            giftCards: data.giftCards || [],
            totalPages: data.pagination?.totalPages || 1,
          },
        });
      } catch (error) {
        console.error("Error fetching gift cards:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  // Auto-fetch quand les filtres changent
  useEffect(() => {
    fetchGiftCards(state.status, state.search, state.page);
  }, [fetchGiftCards, state.status, state.search, state.page]);

  // Actions stables
  const setStatus = useCallback((status: GiftCardStatus | "all") => {
    dispatch({ type: "SET_STATUS", payload: status });
  }, []);

  const setSearch = useCallback((search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const retry = useCallback(() => {
    fetchGiftCards(state.status, state.search, state.page);
  }, [fetchGiftCards, state.status, state.search, state.page]);

  const actions = useMemo(
    () => ({
      setStatus,
      setSearch,
      setPage,
      resetFilters,
      retry,
    }),
    [setStatus, setSearch, setPage, resetFilters, retry]
  );

  const contextValue = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return (
    <GiftCardContext.Provider value={contextValue}>
      {children}
    </GiftCardContext.Provider>
  );
}

// Hook personnalisé
export function useGiftCards() {
  const context = useContext(GiftCardContext);
  if (context === undefined) {
    throw new Error("useGiftCards must be used within a GiftCardProvider");
  }
  return context;
}
