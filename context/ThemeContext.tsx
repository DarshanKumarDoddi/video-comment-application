import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import { lightColors, darkColors, ThemeColors } from "../constants/theme";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  mode: "system",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    SecureStore.getItemAsync("theme-mode").then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setMode(saved);
      }
    });
  }, []);

  const isDark =
    mode === "system" ? systemColorScheme === "dark" : mode === "dark";

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const next: ThemeMode = isDark ? "light" : "dark";
    setMode(next);
    SecureStore.setItemAsync("theme-mode", next);
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
