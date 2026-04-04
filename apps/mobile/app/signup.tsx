import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

const API_BASE = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000"
  : "https://clarix.app";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/sign-up/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error?.message || "Registration failed");
        return;
      }

      router.replace("/");
    } catch (err) {
      setError("Cannot connect to server. Check your network.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Get started with Clarix</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Sarah Chen"
          placeholderTextColor="#52525b"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="sarah@pharma.com"
          placeholderTextColor="#52525b"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#52525b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#09090b" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")} activeOpacity={0.7}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09090b",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#18181b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#09090b",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fafafa",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#71717a",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#a1a1aa",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#09090b",
    color: "#fafafa",
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 6,
    padding: 12,
    fontSize: 15,
    minHeight: 44,
  },
  error: {
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    minHeight: 44,
  },
  buttonDisabled: {
    backgroundColor: "#3f3f46",
  },
  buttonText: {
    color: "#09090b",
    fontWeight: "600",
    fontSize: 15,
  },
  linkText: {
    color: "#71717a",
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
  linkBold: {
    color: "#fafafa",
    textDecorationLine: "underline",
  },
});
