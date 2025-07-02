import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.flex1} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Section with flat background */}
        <View style={styles.userInfoFlat}>
          <View style={styles.userInfoRow}>
            <Avatar.Text size={56} label={(user?.name || user?.email || "U").charAt(0).toUpperCase()} style={styles.avatar} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.userNameFlat}>{user?.name || "User"}</Text>
              <Text style={styles.userEmailFlat}>{user?.email || "user@email.com"}</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.card}>
          <List.Item title="Email" left={props => <List.Icon {...props} icon="email-outline" />} description={user?.email} />
          <List.Item title="Username" left={props => <List.Icon {...props} icon="account-outline" />} description={user?.name} />
          <List.Item title="Notifications" left={props => <List.Icon {...props} icon="bell-outline" />} />
          <List.Item title="Language" left={props => <List.Icon {...props} icon="translate" />} />
          <List.Item title="Privacy" left={props => <List.Icon {...props} icon="shield-outline" />} />
        </Card>

        {/* Sign Out Button */}
        <Button mode="contained" style={styles.signOutBtn} icon="logout" onPress={signOut}>
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#f5f6fa" },
  scrollContent: { paddingBottom: 1 },
  userInfoFlat: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 16,
    marginBottom: 8,
  },
  userInfoRow: { flexDirection: "row", alignItems: "center", marginTop: 0 },
  avatar: { backgroundColor: "#4f8cff" },
  userNameFlat: { color: '#222', fontWeight: 'bold', fontSize: 18 },
  userEmailFlat: { color: '#888', fontSize: 13, marginTop: 1 },
  sectionTitle: { marginLeft: 20, marginTop: 12, marginBottom: 4, color: "#4f8cff", fontWeight: "bold", fontSize: 14, letterSpacing: 0.5 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    elevation: 1,
    paddingVertical: 2,
  },
  signOutBtn: {
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#ff5252",
    marginBottom: 20,
  },
}); 