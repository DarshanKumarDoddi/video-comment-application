import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { setUser } = useAuth();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          username: session.user.user_metadata?.full_name,
        });
        router.replace("/");
      } else {
        router.replace("/auth/login");
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
