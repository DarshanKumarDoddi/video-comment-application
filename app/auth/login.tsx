import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useTheme } from "../../context/ThemeContext";
import { signIn, signUp, setDisplayName } from "../../lib/auth";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DisplayNamePrompt from "../../components/DisplayNamePrompt";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CALLBACK_URL = AuthSession.makeRedirectUri({
  scheme: "vidtalk",
  path: "auth/callback",
});

function getQueryParam(url: string, key: string): string | null {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { setUser } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await WebBrowser.warmUpAsync();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: GOOGLE_CALLBACK_URL,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("Failed to start Google sign-in");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        GOOGLE_CALLBACK_URL,
        { preferEphemeralSession: false }
      );

      if (result.type !== "success" || !result.url) {
        return;
      }

      const code = getQueryParam(result.url, "code");
      if (!code) throw new Error("No authorization code returned");

      const { data: sessionData, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) throw sessionError;
      if (sessionData.user) {
        const user = {
          id: sessionData.user.id,
          email: sessionData.user.email ?? "",
          username: sessionData.user.user_metadata?.full_name,
        };
        setUser(user);
        router.back();
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
      WebBrowser.coolDownAsync();
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (isSignup && !username.trim()) {
      Alert.alert("Error", "Username is required");
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const user = await signUp(email, password, username);
        setUser(user);
        setShowNamePrompt(true);
      } else {
        const result = await signIn(email, password);
        setUser(result.user);
        router.back();
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNameSaved = async (name: string) => {
    await setDisplayName(name);
    setShowNamePrompt(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {isSignup ? "Sign Up" : "Login"}
        </Text>

        {GOOGLE_CLIENT_ID ? (
          <>
            <TouchableOpacity
              style={[styles.googleBtn, { borderColor: colors.border }]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={18} color="#fff" />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.secondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>
          </>
        ) : null}

        {isSignup && (
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            placeholder="Username"
            placeholderTextColor={colors.secondary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.secondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          placeholder="Password"
          placeholderTextColor={colors.secondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignup ? "Sign Up" : "Login"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={[styles.toggle, { color: colors.primary }]}>
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>

      <DisplayNamePrompt
        visible={showNamePrompt}
        onSubmit={handleNameSaved}
        onSkip={() => {
          setShowNamePrompt(false);
          router.back();
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  form: { padding: 24, gap: 12 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: "#4285F4",
  },
  googleBtnText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  toggle: { textAlign: "center", marginTop: 16, fontSize: 14 },
});
