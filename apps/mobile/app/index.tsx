import { View, Text, StyleSheet, Platform } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <Text style={styles.subtitle}>
        Clarix 503B — {Platform.OS === "web" ? "Web" : Platform.OS === "ios" ? "iOS" : "Android"}
      </Text>
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
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fafafa",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#a1a1aa",
  },
});
