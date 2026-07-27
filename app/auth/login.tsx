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
import { useTheme } from "../../context/ThemeContext";
import { signIn, signUp } from "../../lib/auth";

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

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
        await signUp(email, password, username);
        Alert.alert("Success", "Account created! Please login.");
        setIsSignup(false);
      } else {
        await signIn(email, password);
        router.back();
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  form: { padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 16 },
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
