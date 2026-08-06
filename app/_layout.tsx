import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import {
  registerForPushNotifications,
  addNotificationResponseListener,
} from "../lib/notifications";

function RootLayoutInner() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const responseListener = useRef<ReturnType<typeof addNotificationResponseListener> | null>(null);

  useEffect(() => {
    registerForPushNotifications();

    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.videoId) {
        router.push(`/watch/${data.videoId}`);
      }
    });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootLayoutInner />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
