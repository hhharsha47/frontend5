"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

/**
 * UnderConstructionContext
 *
 * Manages the state of the under construction popup.
 * Provides methods to show/hide the popup when users interact with products or buttons.
 */
interface UnderConstructionContextType {
  showPopup: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const UnderConstructionContext = createContext<
  UnderConstructionContextType | undefined
>(undefined);

export function UnderConstructionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * Show the popup when user tries to interact with products/buttons
   */
  const showPopup = () => {
    // Only check localStorage on client side
    if (typeof window !== "undefined") {
      // Check if developer has bypassed
      const isBypassed = localStorage.getItem("dev_bypass") === "true";
      if (!isBypassed) {
        setIsOpen(true);
      }
    } else {
      // If not on client, just show the popup
      setIsOpen(true);
    }
  };

  return (
    <UnderConstructionContext.Provider value={{ showPopup, isOpen, setIsOpen }}>
      {children}
    </UnderConstructionContext.Provider>
  );
}

/**
 * Hook to access the under construction context
 */
export function useUnderConstruction() {
  const context = useContext(UnderConstructionContext);
  if (context === undefined) {
    throw new Error(
      "useUnderConstruction must be used within UnderConstructionProvider"
    );
  }
  return context;
}
