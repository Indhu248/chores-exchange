import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Avatar, IconButton, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyNotifications = [
  {
    id: "1",
    title: "Chore Accepted!",
    description: "Sarah Lee accepted your Dog Walking chore.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "2m ago",
  },
  {
    id: "2",
    title: "New Message",
    description: "Mike Johnson sent you a message.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "10m ago",
  },
  {
    id: "3",
    title: "Chore Completed!",
    description: "Emily Chen completed your Lawn Mowing chore.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    time: "1h ago",
  },
  {
    id: "4",
    title: "Friend Request",
    description: "Priya Patel sent you a friend request.",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    time: "2h ago",
  },
  {
    id: "5",
    title: "Chore Reminder",
    description: "Don't forget your Grocery Shopping chore today!",
    avatar: undefined,
    time: "Today",
  },
];

export default function NotificationScreen() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.headerRow}>
        <IconButton icon="arrow-left" size={26} onPress={() => router.back()} style={styles.backBtn} />
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.description}
            left={props =>
              item.avatar ? (
                <Avatar.Image size={40} source={{ uri: item.avatar }} style={styles.avatar} />
              ) : (
                <Avatar.Icon size={40} icon="bell-outline" style={styles.avatar} />
              )
            }
            right={props => <Text style={styles.time}>{item.time}</Text>}
            style={styles.listItem}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: "#fafbfc" },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 4,
  },
  backBtn: {
    marginRight: 4,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 24,
  },
  listItem: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  avatar: {
    backgroundColor: "#eaeaea",
    marginRight: 8,
  },
  time: {
    color: "#888",
    fontSize: 13,
    alignSelf: "center",
    marginRight: 8,
  },
}); 