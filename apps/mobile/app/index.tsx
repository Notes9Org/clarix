import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity, ActivityIndicator } from "react-native";
import { router } from "expo-router";

const API_BASE = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://localhost:3000"
  : "https://clarix.app";

export default function HomeScreen() {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/get-session`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
      }
    } catch {
      // No session — that's fine
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fafafa" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {String(user.name)}</Text>
          <Text style={styles.subtitle}>
            {String(user.email)} · {String(user.role || "read_only").replace(/_/g, " ")}
          </Text>
          <Text style={styles.platform}>
            {Platform.OS === "ios" ? "📱 iPad" : Platform.OS === "android" ? "🤖 Android" : "🌐 Web"}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Clarix 503B</Text>
          <Text style={styles.subtitle}>
            {Platform.OS === "ios" ? "iPad" : Platform.OS === "android" ? "Android" : "Web"} — Digital Batch Records
          </Text>
          <View style={{ gap: 12, marginTop: 8 }}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/login")}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => router.push("/signup")}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09090b",
    gap: 16,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fafafa",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#a1a1aa",
    textAlign: "center",
  },
  platform: {
    fontSize: 14,
    color: "#52525b",
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: "#fafafa",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#09090b",
    fontWeight: "600",
    fontSize: 14,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: "#3f3f46",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fafafa",
    fontWeight: "600",
    fontSize: 14,
  },
});
