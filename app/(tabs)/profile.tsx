import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const mockProfile = {
  name: "Lucas Bennett",
  email: "lucasbennett@gmail.com",
  avatarUrl: undefined, // Use a real image URL if available
  followers: 1500,
  following: 0,
  points: 145, // Chore Points
  level: 3,
  topCategory: "Cleaning",
  totalChores: 42,
  weeklyChores: [2, 4, 3, 5, 1, 6, 4], // Sun-Sat
};

export default function ProfileScreen() {
  const { user } = useAuth();
  const profile = mockProfile; // Replace with real user data if available
  const router = useRouter();

  // Use user email if available, otherwise fallback to mock
  const displayEmail = user?.email || profile.email;

  return (
    <SafeAreaView style={styles.flex1} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerBg}>
          <IconButton icon="arrow-left" size={24} style={styles.headerBtn} onPress={() => {}} />
          <IconButton icon="cog-outline" size={24} style={[styles.headerBtn, { right: 20, left: undefined }]} onPress={() => router.push("/settings")} />
          <View style={styles.avatarWrapper}>
            {profile.avatarUrl ? (
              <Avatar.Image size={84} source={{ uri: profile.avatarUrl }} />
            ) : (
              <Avatar.Text size={84} label={profile.name.charAt(0)} style={styles.avatar} />
            )}
          </View>
        </View>
        {/* Card Overlay */}
        <View style={styles.cardOverlay}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.emailCustom}>{displayEmail}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{profile.followers / 1000}K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{profile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
          {/* 2x2 Grid of Stat Cards */}
          <View style={styles.gridRow}>
            <Card style={styles.gridCard}>
              <Card.Content style={styles.gridCardContent}>
                <Avatar.Icon size={32} icon="star" style={styles.gridIcon} />
                <Text style={styles.gridValue}>{profile.points}</Text>
                <Text style={styles.gridLabel}>Chore Points</Text>
              </Card.Content>
            </Card>
            <Card style={styles.gridCard}>
              <Card.Content style={styles.gridCardContent}>
                <Avatar.Icon size={32} icon="trophy" style={styles.gridIcon} />
                <Text style={styles.gridValue}>{profile.level}</Text>
                <Text style={styles.gridLabel}>Level</Text>
              </Card.Content>
            </Card>
          </View>
          <View style={styles.gridRow}>
            <Card style={styles.gridCard}>
              <Card.Content style={styles.gridCardContent}>
                <Avatar.Icon size={32} icon="broom" style={styles.gridIcon} />
                <Text style={styles.gridValue}>{profile.topCategory}</Text>
                <Text style={styles.gridLabel}>Top Category</Text>
              </Card.Content>
            </Card>
            <Card style={styles.gridCard}>
              <Card.Content style={styles.gridCardContent}>
                <Avatar.Icon size={32} icon="check-circle" style={styles.gridIcon} />
                <Text style={styles.gridValue}>{profile.totalChores}</Text>
                <Text style={styles.gridLabel}>Total Chores</Text>
              </Card.Content>
            </Card>
          </View>
          {/* Weekly Chores Bar Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weekly Chores</Text>
            <View style={styles.chartRow}>
              {profile.weeklyChores.map((count, idx) => (
                <View key={idx} style={styles.chartBarWrapper}>
                  <View style={[styles.chartBar, { height: count * 10 }]} />
                  <Text style={styles.chartBarLabel}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = 140;
const AVATAR_SIZE = 84;
const CARD_WIDTH = (width - 64) / 2;

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#f5f6fa" },
  scrollContent: { paddingBottom: 32 },
  headerBg: {
    height: HEADER_HEIGHT,
    backgroundColor: "#1ec6b6",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtn: {
    position: "absolute",
    top: 16,
    left: 20,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -AVATAR_SIZE / 2,
    left: width / 2 - AVATAR_SIZE / 2,
    zIndex: 3,
    backgroundColor: "#fff",
    borderRadius: AVATAR_SIZE / 2,
    padding: 4,
    elevation: 4,
  },
  avatar: { backgroundColor: "#4f8cff" },
  cardOverlay: {
    marginTop: AVATAR_SIZE / 2 + 16,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  name: { fontWeight: "bold", fontSize: 22, color: "#222" },
  email: { color: "#888", fontSize: 15, marginBottom: 4 },
  emailCustom: { color: "#1976D2", fontSize: 15, marginBottom: 4, fontWeight: "500" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  statCol: { alignItems: "center", flex: 1 },
  statValue: { fontWeight: "bold", fontSize: 16, color: "#222" },
  statLabel: { color: "#888", fontSize: 13 },
  gridRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  gridCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: "#f8f8f8",
    elevation: 0,
    paddingVertical: 8,
  },
  gridCardContent: { alignItems: "center" },
  gridIcon: { backgroundColor: "#e3eaff", marginBottom: 4 },
  gridValue: { fontWeight: "bold", fontSize: 18, color: "#222" },
  gridLabel: { color: "#888", fontSize: 13 },
  chartCard: {
    marginTop: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
  },
  chartTitle: { fontWeight: "bold", fontSize: 16, color: "#222", marginBottom: 8 },
  chartRow: { flexDirection: "row", alignItems: "flex-end", width: "100%" },
  chartBarWrapper: { flex: 1, alignItems: "center" },
  chartBar: {
    width: 18,
    borderRadius: 8,
    backgroundColor: "#1ec6b6",
    marginBottom: 4,
  },
  chartBarLabel: { fontSize: 12, color: "#888" },
}); 